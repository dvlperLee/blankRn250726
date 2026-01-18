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
import { commonAPI } from '../services/apiService'
import KeyEvent from "react-native-keyevent";

const Export = ({ navigation }) => {
  const [containerNumber, setcontainerNumber] = useState('');
  const [bringOutRegistrationNumber, setBringOutRegistrationNumber] = useState('');
  const [blNumber, setBlNumber] = useState('');
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
        const response = await commonAPI.selectContainerNumberForBringOut({});
        console.log('[Export] API 응답:', response);
        console.log('[Export] 응답 타입:', typeof response, Array.isArray(response));
        
        // 응답이 배열이 아니면 배열로 변환
        let conNumberList = response;
        if (!Array.isArray(response)) {
          if (response && response.data && Array.isArray(response.data)) {
            conNumberList = response.data;
          } else if (response && response.list && Array.isArray(response.list)) {
            conNumberList = response.list;
          } else {
            console.warn('[Export] 응답이 배열이 아닙니다:', response);
            conNumberList = [];
          }
        }
        // TODO: 반출 등록 로직 추가
        console.log('[Export] 처리된 컨테이너 목록:', conNumberList);
        console.log('[Export] 첫 번째 아이템 샘플:', conNumberList[0]);
        console.log('[Export] 목록 개수:', conNumberList.length);
        
        setConNumberList(conNumberList);
        setFilteredContainers(conNumberList);
      } catch (error) {
        console.error('[Export] 컨테이너 번호 조회 실패:', error);
        Alert.alert('오류', error.message || '컨테이너 번호를 가져오는데 실패했습니다.');
      }
      
      KeyEvent.onKeyDownListener((e) => {       
        console.log('KeyEvent.onKeyDownListener : ', e);
        if (e.keyCode === 66 || e.keyCode === 160) {
          console.log('handleContainerKeyPress : ', e);
        }
      });

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
    if (!containerNumber || !bringOutRegistrationNumber) {
      Alert.alert('오류', '컨테이너 번호와 차량 번호를 입력해주세요.');
      return;
    }

    try {
      // 백엔드 API 호출
      const exportResult = await commonAPI.export({ 
        blNumber: blNumber,
        containerNumber: containerNumber,
        bringOutRegistrationNumber: bringOutRegistrationNumber,
        userId: 'lee'
      });
      if(exportResult){  
        Alert.alert('반출 등록', '반출이 성공적으로 등록되었습니다.', [
          { text: '확인', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('반출 등록', '반출이 실패했습니다.', [
          { text: '확인', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      console.error( error);
      Alert.alert(error);
    }

    
  };

  const handleVehicleSubmit = () => {
    // 차량번호 입력 후 엔터를 누르면 확인 버튼 클릭
    handleConfirm();
  };

  const handleContainerChange = (text) => {
    setcontainerNumber(text);
    
    // 입력된 텍스트로 컨테이너 목록 필터링 (containerNumber 또는 conNumber로 검색)
    if (text) {
      const filtered = conNumberList.filter(container => {
        if (typeof container === 'object') {
          const containerValue = container.containerNumber || '';
          return containerValue.includes(text);
        }
        return String(container || '').includes(text);
      });
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
      const firstItem = filteredContainers[0];
      const containerValue = typeof firstItem === 'object' 
        ? (firstItem.containerNumber || '')
        : firstItem;
      const blNumberValue = typeof firstItem === 'object' 
        ? (firstItem.blNumber || '')
        : firstItem;
      setcontainerNumber(containerValue);
      setBlNumber(blNumberValue);
      setShowContainerDropdown(false);
    }
    // 차량번호 입력창으로 포커스 이동
    vehicleNoInputRef.current?.focus();
  };  

  const handleContainerKeyPress = ({ nativeEvent }) => {
    // 외부 키패드의 Enter 키 감지 (키 코드 66 또는 Enter)
    console.log('handleContainerKeyPress : ', nativeEvent);
    if (nativeEvent.key === 'Enter' || nativeEvent.keyCode === 66) {
      handleContainerSubmit();
    }
  };

  const handleContainerFocus = () => {
    setShowContainerDropdown(true);
    if (containerNumber) {
      const filtered = conNumberList.filter(container => {
        if (typeof container === 'object') {
          const containerValue = container.containerNumber || '';
          return containerValue.includes(containerNumber);
        }
        return String(container || '').includes(containerNumber);
      });
      setFilteredContainers(filtered);
    } else {
      setFilteredContainers(conNumberList);
    }
  };

  const handleDropdownItemPress = (item) => {
    console.log('드롭다운 아이템 터치:', item); // 디버깅용
    // 객체인 경우 containerNumber 또는 conNumber 사용
    const containerValue = typeof item === 'object' 
      ? (item.containerNumber)
      : item;
    const blNumberValue = typeof item === 'object' 
      ? (item.blNumber)
      : item;
    setcontainerNumber(containerValue);
    setBlNumber(blNumberValue);
    setShowContainerDropdown(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.backText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>반출</Text>
      </View>

      <View style={styles.content}>               
        <View style={styles.comboContainer}>
          <TextInput
            ref={containerInputRef}
            style={styles.comboInput}
            placeholder="컨테이너 번호 입력"
            value={containerNumber}
            onChangeText={handleContainerChange}
            onFocus={() => {
              console.log('[Export] 컨테이너 입력 포커스');
              handleContainerFocus();
            }}
            onSubmitEditing={() => {
              console.log('[Export] 컨테이너 onSubmitEditing 이벤트 발생');
              handleContainerSubmit();
            }}
            onKeyPress={handleContainerKeyPress}
            keyboardType="default"
            returnKeyType="next"
            autoCapitalize="characters"
          />
          <Text style={styles.comboArrow}>▼</Text>
          
          <TextInput
            ref={vehicleNoInputRef}
            style={styles.input}
            placeholder="차량 번호 입력 (4자리)"
            value={bringOutRegistrationNumber}
            onChangeText={setBringOutRegistrationNumber}
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
                  // 객체인 경우 containerNumber를 키로 사용
                  if (typeof item === 'object') {
                    const key = item.containerNumber || item.conNumber || '';
                    return (key || 'item') + '_' + index;
                  }
                  return String(item || 'item') + '_' + index;
                }}
                renderItem={({ item }) => {
                  // containerNumber 또는 conNumber 표시
                  let displayText = '';
                  if (typeof item === 'object') {
                    displayText = item.containerNumber || item.conNumber || '';
                  } else {
                    displayText = item || '';
                  }
                  
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
    backgroundColor: '#FF6B6B',
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
    top: 50, // 컨테이너 입력 필드 높이만큼 아래로 (comboInput 높이)
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
    marginTop: 2, // 입력 필드와 약간의 간격
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
  cancelButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#FF6B6B', marginRight: 10 },
  confirmButton: { backgroundColor: '#FF6B6B', marginLeft: 10 },
  cancelText: { color: '#FF6B6B', fontSize: 16, fontWeight: '600' },
  confirmText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default Export;