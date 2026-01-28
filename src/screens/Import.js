import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
} from 'react-native';
import { commonAPI } from '../services/apiService'
import KeyEvent from "react-native-keyevent";

const Import = ({ navigation }) => {
  const [containerNumber, setcontainerNumber] = useState('');
  const [bringInRegistrationNumber, setBringInRegistrationNumber] = useState('');
  const [blNumber, setBlNumber] = useState('');
  const [showContainerDropdown, setShowContainerDropdown] = useState(false);
  const [filteredContainers, setFilteredContainers] = useState([]);
  const vehicleNoInputRef = useRef(null);
  const containerInputRef = useRef(null);

  // 컨테이너 번호 목록 상태 (API에서 가져온 데이터)
  const [conNumberList, setConNumberList] = useState([]);

  // 커스텀 알림 상태
  const [customAlert, setCustomAlert] = useState({
    visible: false,
    title: '',
    message: '',
    onConfirm: null
  });

  const showCustomAlert = (title, message, onConfirm) => {
    setCustomAlert({
      visible: true,
      title,
      message,
      onConfirm
    });
  };

  useEffect(() => {
    // 화면 시작할 때 컨테이너 번호 목록을 가져오는 함수
    const fetchContainerNumbers = async () => {
      try {
        // 컨테이너넘버 콤보 조회
        const response = await commonAPI.selectContainerNumber({});
        console.log('[Import] API 응답:', response);
        console.log('[Import] 응답 타입:', typeof response, Array.isArray(response));

        // 응답이 배열이 아니면 배열로 변환
        let conNumberList = response;
        if (!Array.isArray(response)) {
          if (response && response.data && Array.isArray(response.data)) {
            conNumberList = response.data;
          } else if (response && response.list && Array.isArray(response.list)) {
            conNumberList = response.list;
          } else {
            console.warn('[Import] 응답이 배열이 아닙니다:', response);
            conNumberList = [];
          }
        }

        console.log('[Import] 처리된 컨테이너 목록:', conNumberList);
        console.log('[Import] 첫 번째 아이템 샘플:', conNumberList[0]);
        console.log('[Import] 목록 개수:', conNumberList.length);

        setConNumberList(conNumberList);
        setFilteredContainers(conNumberList);
      } catch (error) {
        console.error('[Import] 컨테이너 번호 조회 실패:', error);
        Alert.alert('오류', error.message || '컨테이너 번호를 가져오는데 실패했습니다.');
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

  // 키 이벤트 리스너 설정
  useEffect(() => {
    console.log('[Import] 키 이벤트 리스너 등록');

    // 키 다운 이벤트
    KeyEvent.onKeyDownListener((e) => {
      console.log(`[Import] KeyDown - keyCode: ${e.keyCode}, key: ${e.pressedKey}`);
      // Enter 키(66) 또는 Numpad Enter(160) 처리
      if (e.keyCode === 66 || e.keyCode === 160) {
        console.log('[Import] Enter 키 감지됨');

        // 1. 알림창이 떠있는 경우 확인 동작 실행
        let alertHandled = false;
        setCustomAlert(prev => {
          if (prev.visible && prev.onConfirm) {
            console.log('[Import] 알림창 확인 동작 실행 (Enter)');
            const confirmFn = prev.onConfirm;
            setTimeout(() => confirmFn(), 10);
            alertHandled = true;
            return { ...prev, visible: false };
          }
          return prev;
        });

        // 2. 알림창이 없고 컨테이너 입력창에 포커스가 있는 경우 제출 처리
        // (필터링된 목록이 비어있어도 첫 번째 것을 선택하거나 기존 입력을 유지하게 됨)
        if (!alertHandled && containerInputRef.current?.isFocused()) {
          console.log('[Import] 컨테이너 입력창 Enter 처리');
          handleContainerSubmit();
        }
      }
    });

    // 키 업 이벤트
    KeyEvent.onKeyUpListener((e) => {
      console.log(`[Import] KeyUp - keyCode: ${e.keyCode}, key: ${e.pressedKey}`);
    });

    // 키 멀티플 이벤트 (연속 입력 등)
    KeyEvent.onKeyMultipleListener((e) => {
      console.log(`[Import] KeyMultiple - keyCode: ${e.keyCode}, characters: ${e.characters}`);
    });

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      console.log('[Import] 키 이벤트 리스너 해제');
      KeyEvent.removeKeyDownListener();
      KeyEvent.removeKeyUpListener();
      KeyEvent.removeKeyMultipleListener();
    };
  }, [filteredContainers]); // filteredContainers 상태를 참조하도록 의존성 추가

  const handleCancel = () => navigation.goBack();

  const handleConfirm = async () => {
    if (!containerNumber || !bringInRegistrationNumber) {
      Alert.alert('오류', '컨테이너 번호와 차량 번호를 입력해주세요.');
      return;
    }

    try {
      // 백엔드 API 호출
      const importResult = await commonAPI.import({
        blNumber: blNumber,
        containerNumber: containerNumber,
        bringInRegistrationNumber: bringInRegistrationNumber,
        userId: 'lee'
      });
      if (importResult) {
        showCustomAlert('반입 등록', '반입이 성공적으로 등록되었습니다.', () => {
          navigation.navigate('Main');
        });
      } else {
        showCustomAlert('반입 등록', '반입이 실패했습니다.', () => {
          navigation.navigate('Main');
        });
      }
    } catch (error) {
      console.error(error);
      showCustomAlert('오류', error.message || String(error), () => { });
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
    console.log('[Import] handleContainerSubmit 실행');
    // Enter 키를 눌렀을 때 첫 번째 필터링된 결과 선택하고 차량번호로 포커스 이동
    if (filteredContainers.length > 0) {
      const firstItem = filteredContainers[0];
      const containerValue = typeof firstItem === 'object'
        ? (firstItem.containerNumber || '')
        : firstItem;
      const blNumberValue = typeof firstItem === 'object'
        ? (firstItem.blNumber || '')
        : firstItem;

      console.log('[Import] 첫 번째 아이템 선택:', containerValue);
      setcontainerNumber(containerValue);
      setBlNumber(blNumberValue);
    }

    // 무조건 드롭다운 닫기
    setShowContainerDropdown(false);

    // UI 업데이트와 충돌을 피하기 위해 약간의 지연 후 포커스 이동
    setTimeout(() => {
      console.log('[Import] 차량번호 입력창 포커스 시도');
      vehicleNoInputRef.current?.focus();
    }, 150);
  };

  // const handleContainerSelect = (selectedContainer) => {
  //   console.log('선택된 컨테이너:', selectedContainer); // 디버깅용
  //   // 객체인 경우 containerNumber 또는 conNumber 사용
  //   const containerValue = typeof selectedContainer === 'object' 
  //     ? (selectedContainer.containerNumber || '')
  //     : selectedContainer;
  //   setcontainerNumber(containerValue);
  //   setShowContainerDropdown(false);
  // };

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

  //   const handleContainerBlur = () => {
  //     // 포커스 아웃 시 드롭다운 닫기 (더 긴 지연)
  //     setTimeout(() => {
  //       setShowContainerDropdown(false);
  //     }, 500);
  //   };

  const handleDropdownItemPress = (item) => {
    console.log('드롭다운 아이템 터치 선택:', item);
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

    // 터치 선택 후에도 차량번호 입력창으로 포커스 이동
    setTimeout(() => {
      vehicleNoInputRef.current?.focus();
    }, 150);
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
            value={containerNumber}
            onChangeText={handleContainerChange}
            onFocus={() => {
              console.log('[Import] 컨테이너 입력 포커스');
              handleContainerFocus();
            }}
            onSubmitEditing={() => {
              console.log('[Import] 컨테이너 onSubmitEditing 이벤트 발생');
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
            value={bringInRegistrationNumber}
            onChangeText={setBringInRegistrationNumber}
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

      {/* 커스텀 알림 모달 */}
      <Modal
        visible={customAlert.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setCustomAlert({ ...customAlert, visible: false })}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{customAlert.title}</Text>
            <Text style={styles.modalMessage}>{customAlert.message}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                const confirmFn = customAlert.onConfirm;
                setCustomAlert({ ...customAlert, visible: false });
                if (confirmFn) confirmFn();
              }}
            >
              <Text style={styles.modalButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  cancelButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#007AFF', marginRight: 10 },
  confirmButton: { backgroundColor: '#007AFF', marginLeft: 10 },
  cancelText: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
  confirmText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Import;