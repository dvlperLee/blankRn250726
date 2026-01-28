import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import KeyEvent from 'react-native-keyevent';

const MainScreen = ({ navigation }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const showLogoutModalRef = useRef(false);

  // ref 동기화
  useEffect(() => {
    showLogoutModalRef.current = showLogoutModal;
  }, [showLogoutModal]);

  const menuItems = [
    { id: 1, title: '반입', icon: '📥' },
    { id: 2, title: '반출', icon: '📤' },
    { id: 3, title: '입반출관리', icon: '⚙️' },
    { id: 4, title: '입반출내역', icon: '📋' },
    { id: 5, title: '로그아웃', icon: '🚪' },
  ];

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    navigation.replace('Login');
  };

  const handleMenuPress = (item) => {
    if (item.title === '로그아웃') {
      setShowLogoutModal(true);
    } else if (item.title === '반입') {
      navigation.navigate('Import');
    } else if (item.title === '반출') {
      navigation.navigate('Export');
    } else if (item.title === '입반출관리') {
      navigation.navigate('Management');
    } else if (item.title === '입반출내역') {
      navigation.navigate('History');
    }
  };

  useFocusEffect(
    useCallback(() => {
      KeyEvent.onKeyDownListener((e) => {
        const keyCode = e.keyCode;
        const pressedKey = String(e.pressedKey || '');

        // 모달이 열려있을 때 Enter 처리
        if (showLogoutModalRef.current) {
          if (keyCode === 66 || keyCode === 13) {
            handleLogoutConfirm();
            return;
          }
        }

        if (keyCode === 8 || pressedKey === '1') {
          handleMenuPress(menuItems[0]);
        } else if (keyCode === 9 || pressedKey === '2') {
          handleMenuPress(menuItems[1]);
        } else if (keyCode === 10 || pressedKey === '3') {
          handleMenuPress(menuItems[2]);
        } else if (keyCode === 11 || pressedKey === '4') {
          handleMenuPress(menuItems[3]);
        } else if (keyCode === 12 || pressedKey === '5') {
          handleMenuPress(menuItems[4]);
        }
      });

      return () => {
        KeyEvent.removeKeyDownListener();
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>입반출 관리 시스템</Text>
        <Text style={styles.welcomeText}>환영합니다!</Text>
      </View>

      <ScrollView style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => handleMenuPress(item)}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 로그아웃 확인 모달 */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>로그아웃</Text>
            <Text style={styles.modalMessage}>정말 로그아웃하시겠습니까?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleLogoutConfirm}
              >
                <Text style={styles.confirmButtonText}>로그아웃</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  menuContainer: {
    flex: 1,
    padding: 20,
  },
  menuItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  confirmButton: {
    backgroundColor: '#FF3B30',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MainScreen;