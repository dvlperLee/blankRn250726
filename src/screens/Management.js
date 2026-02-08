import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import KeyEvent from 'react-native-keyevent';

const Management = ({ navigation }) => {
  const hiddenInputRef = React.useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      // 화면 진입 시 숨겨진 입력창에 포커스 (키 이벤트 수신 확보)
      const timer = setTimeout(() => {
        hiddenInputRef.current?.focus();
      }, 100);

      KeyEvent.onKeyDownListener((e) => {
        const pressedKey = e.pressedKey ? String(e.pressedKey) : '';
        const keyCode = e.keyCode;

        if (pressedKey === '1' || keyCode === 8 || keyCode === 145) {
          navigation.navigate('ImportMgmt');
        } else if (pressedKey === '2' || keyCode === 9 || keyCode === 146) {
          navigation.navigate('ExportMgmt');
        } else if (keyCode === 4 || keyCode === 111) {
          navigation.goBack();
        }
      });

      return () => {
        clearTimeout(timer);
        KeyEvent.removeKeyDownListener();
        KeyEvent.removeKeyUpListener();
        KeyEvent.removeKeyMultipleListener();
      };
    }, [navigation])
  );

  return (
    <View style={styles.container}>
      <TextInput
        ref={hiddenInputRef}
        style={styles.hiddenInput}
        showSoftInputOnFocus={false}
        autoFocus={true}
        caretHidden={true}
        onChangeText={(text) => {
          if (!text) return;
          const key = text.slice(-1);
          if (key === '1') navigation.navigate('ImportMgmt');
          else if (key === '2') navigation.navigate('ExportMgmt');
          hiddenInputRef.current?.clear();
        }}
        value=""
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>입반출 관리</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('ImportMgmt')}
        >
          <Text style={styles.menuText}>반입관리</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('ExportMgmt')}
        >
          <Text style={styles.menuText}>반출관리</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#28A745',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backText: { color: '#fff', fontSize: 16 },
  headerTitle: { flex: 1, textAlign: 'center', color: '#fff', fontSize: 20, fontWeight: 'bold' },

  content: { flex: 1, paddingTop: 30 },
  menuItem: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuText: { fontSize: 18, fontWeight: '600', color: '#333' },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
});

export default Management;
