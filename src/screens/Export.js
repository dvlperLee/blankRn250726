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

const Export = ({ navigation }) => {
  const [containerNo, setContainerNo] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [showContainerDropdown, setShowContainerDropdown] = useState(false);
  const [filteredContainers, setFilteredContainers] = useState([]);
  const vehicleNoInputRef = useRef(null);
  const containerInputRef = useRef(null);

  // 컨테이너 번호 목록 (예시 데이터)
  const containerOptions = [
    '0001', '0002', '0003', '0004', '0005',
    '0006', '0007', '0008', '0009', '0010',
    '1001', '1002', '1003', '1004', '1005',
    '2001', '2002', '2003', '2004', '2005'
  ];

  useEffect(() => {
    // 화면 진입 시 차량번호 입력창에 포커스
    const timer = setTimeout(() => {
      vehicleNoInputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleCancel = () => navigation.goBack();

  const handleConfirm = () => {
    if (!containerNo || !vehicleNo) {
      Alert.alert('오류', '컨테이너 번호와 차량 번호를 입력해주세요.');
      return;
    }
    // TODO: 반출 등록 로직 추가
    Alert.alert('반출 등록', '반출이 성공적으로 등록되었습니다.', [
      { text: '확인', onPress: () => navigation.goBack() },
    ]);
  };

  const handleVehicleSubmit = () => {
    // 차량번호 입력 후 컨테이너 입력창에 포커스
    containerInputRef.current?.focus();
    setShowContainerDropdown(true);
    setFilteredContainers(containerOptions);
  };

  const handleContainerChange = (text) => {
    setContainerNo(text);
    
    // 입력된 텍스트로 컨테이너 목록 필터링
    if (text) {
      const filtered = containerOptions.filter(container => 
        container.includes(text)
      );
      setFilteredContainers(filtered);
      setShowContainerDropdown(true);
    } else {
      setFilteredContainers(containerOptions);
      setShowContainerDropdown(true);
    }
  };

  const handleContainerSubmit = () => {
    // Enter 키를 눌렀을 때 첫 번째 필터링된 결과 선택
    if (filteredContainers.length > 0) {
      setContainerNo(filteredContainers[0]);
      setShowContainerDropdown(false);
    }
  };

  const handleContainerSelect = (selectedContainer) => {
    console.log('선택된 컨테이너:', selectedContainer); // 디버깅용
    setContainerNo(selectedContainer);
    setShowContainerDropdown(false);
  };

  const handleContainerFocus = () => {
    setShowContainerDropdown(true);
    if (containerNo) {
      const filtered = containerOptions.filter(container => 
        container.includes(containerNo)
      );
      setFilteredContainers(filtered);
    } else {
      setFilteredContainers(containerOptions);
    }
  };

  // const handleContainerBlur = () => {
  //   // 포커스 아웃 시 드롭다운 닫기 (더 긴 지연)
  //   setTimeout(() => {
  //     setShowContainerDropdown(false);
  //   }, 500);
  // };

  const handleDropdownItemPress = (item) => {
    console.log('드롭다운 아이템 터치:', item); // 디버깅용
    setContainerNo(item);
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
        <TextInput
          ref={vehicleNoInputRef}
          style={styles.input}
          placeholder="차량 번호 입력 (4자리)"
          value={vehicleNo}
          onChangeText={setVehicleNo}
          maxLength={4}
          keyboardType="number-pad"
          returnKeyType="next"
          onSubmitEditing={handleVehicleSubmit}
        />
        
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
            returnKeyType="done"
          />
          <Text style={styles.comboArrow}>▼</Text>
          
          {showContainerDropdown && filteredContainers.length > 0 && (
            <View style={styles.dropdown}>
              <FlatList
                data={filteredContainers}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleDropdownItemPress(item)}
                    activeOpacity={0.7}
                    delayPressIn={0}
                  >
                    <Text style={styles.dropdownItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
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
  cancelButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#FF6B6B', marginRight: 10 },
  confirmButton: { backgroundColor: '#FF6B6B', marginLeft: 10 },
  cancelText: { color: '#FF6B6B', fontSize: 16, fontWeight: '600' },
  confirmText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default Export;