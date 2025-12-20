import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { commonAPI } from '../services/apiService';

const Import = ({ navigation }) => {
  const [containerNo, setContainerNo] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [showContainerDropdown, setShowContainerDropdown] = useState(false);
  const [filteredContainers, setFilteredContainers] = useState([]);
  const vehicleNoInputRef = useRef(null);
  const containerInputRef = useRef(null);

  // 컨테이너 번호 목록 상태 (API에서 가져온 데이터)
  const [conNumberList, setConNumberList] = useState([]);

  useEffect(() => {
    // 화면 시작할 때 컨테이너 번호 목록을 가져오는 함수
    const fetchContainerNumbers = async () => {
      try {
        // 컨테이너넘버 콤보 조회
        const conNumberList = await commonAPI.selectContainerNumber({});
        setConNumberList(conNumberList);
        setFilteredContainers(conNumberList);
      } catch (error) {
        console.error('컨테이너 번호 조회 실패:', error);
        Alert.alert('오류', '컨테이너 번호를 가져오는데 실패했습니다.');
      }
    };

    // 컨테이너 번호 목록 가져오기
    fetchContainerNumbers();
    
    // 화면 진입 시 컨테이너 번호 입력창에 포커스
    const timer = setTimeout(() => {
      containerInputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleCancel = () => navigation.goBack();

  const handleConfirm = async () => {
    if (!containerNo || !vehicleNo) {
      Alert.alert('오류', '컨테이너 번호와 차량 번호를 입력해주세요.');
      return;
    }

    try {
      // 백엔드 API 호출
      const importResult = await commonAPI.import({
        containerNo: containerNo,
        vehicleNo: vehicleNo,
      });
    } catch (error) {
      console.error( error);
      Alert.alert(error);
    }

    // TODO: 반입 등록 로직 추가
    Alert.alert('반입 등록', '반입이 성공적으로 등록되었습니다.', [
      { text: '확인', onPress: () => navigation.goBack() },
    ]);
  };

  const handleVehicleSubmit = () => {
    // 차량번호 입력 후 엔터를 누르면 확인 버튼 클릭
    handleConfirm();
  };

  const handleContainerChange = (text) => {
    setContainerNo(text);
    
    // 입력된 텍스트로 컨테이너 목록 필터링 (conNumber로만 검색)
    if (text) {
      const filtered = conNumberList.filter(container => 
        container.conNumber?.includes(text)
      );
      setFilteredContainers(filtered);
      setShowContainerDropdown(true);
    } else {
      setFilteredContainers(conNumberList);
      setShowContainerDropdown(true);
    }
  };

  const handleContainerSubmit = () => {
    // Enter 키를 눌렀을 때 첫 번째 필터링된 결과 선택하고 차량번호로 포커스 이동
    if (filteredContainers.length > 0) {
      setContainerNo(filteredContainers[0].conNumber || filteredContainers[0]);
      setShowContainerDropdown(false);
    }
    // 차량번호 입력창으로 포커스 이동
    vehicleNoInputRef.current?.focus();
  };

  const handleContainerSelect = (selectedContainer) => {
    console.log('선택된 컨테이너:', selectedContainer); // 디버깅용
    // 객체인 경우 conNumber 사용, 문자열인 경우 그대로 사용
    const containerValue = selectedContainer.conNumber || selectedContainer;
    setContainerNo(containerValue);
    setShowContainerDropdown(false);
  };

  const handleContainerFocus = () => {
    setShowContainerDropdown(true);
    if (containerNo) {
      const filtered = conNumberList.filter(container => 
        container.conNumber?.includes(containerNo)
      );
      setFilteredContainers(filtered);
    } else {
      setFilteredContainers(conNumberList);
    }
  };

//   const handleContainerBlur = () => {
//     // 포커스 아웃 시 드롭다운 닫기 (더 긴 지연)
//     setTimeout(() => {
//       setShowContainerDropdown(false);
//     }, 500);
//   };

  const handleDropdownItemPress = (item) => {
    console.log('드롭다운 아이템 터치:', item); // 디버깅용
    // 객체인 경우 conNumber 사용, 문자열인 경우 그대로 사용
    const containerValue = item.conNumber || item;
    setContainerNo(containerValue);
    setShowContainerDropdown(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.backText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>반입</Text>
      </View>

      <View style={styles.content}>
        
        
        <View style={styles.comboContainer}>
          <TextInput
            ref={containerInputRef}
            style={styles.comboInput}
            placeholder="컨테이너 번호 입력"
            value={containerNo}
            onChangeText={handleContainerChange}
            onFocus={handleContainerFocus}
            //onBlur={handleContainerBlur}
            onSubmitEditing={handleContainerSubmit}
            keyboardType="number-pad"
            returnKeyType="next"
          />
          <Text style={styles.comboArrow}>▼</Text>
          
          <TextInput
            ref={vehicleNoInputRef}
            style={styles.input}
            placeholder="차량 번호 입력 (4자리)"
            value={vehicleNo}
            onChangeText={setVehicleNo}
            maxLength={4}
            keyboardType="number-pad"
            returnKeyType="done"
            onSubmitEditing={handleVehicleSubmit}
          />
          
          {showContainerDropdown && filteredContainers.length > 0 && (
            <View style={styles.dropdown}>
              <FlatList
                data={filteredContainers}
                keyExtractor={(item, index) => {
                  // 객체인 경우 conNumber를 키로 사용, 없으면 인덱스 사용
                  if (typeof item === 'object' && item.conNumber) {
                    return item.conNumber + index;
                  }
                  return String(item) + index;
                }}
                renderItem={({ item }) => {
                  // conNumber만 표시
                  const displayText = typeof item === 'object' 
                    ? item.conNumber || ''
                    : item;
                  
                  return (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => handleDropdownItemPress(item)}
                      activeOpacity={0.7}
                      delayPressIn={0}
                    >
                      <Text style={styles.dropdownItemText}>{displayText}</Text>
                    </TouchableOpacity>
                  );
                }}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          )}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
          >
            <Text style={styles.cancelText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backText: { color: '#fff', fontSize: 16 },
  headerTitle: { flex: 1, textAlign: 'center', color: '#fff', fontSize: 20, fontWeight: 'bold' },

  content: { flex: 1, padding: 20 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  comboContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  comboInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    paddingRight: 40,
    fontSize: 16,
  },
  comboArrow: {
    position: 'absolute',
    right: 12,
    top: 12,
    fontSize: 12,
    color: '#666',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
  button: { flex: 1, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  cancelButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#007AFF', marginRight: 10 },
  confirmButton: { backgroundColor: '#007AFF', marginLeft: 10 },
  cancelText: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
  confirmText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default Import;