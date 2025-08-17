import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { authAPI } from '../services/apiService';

const LoginScreen = ({ navigation }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const passwordInputRef = useRef(null);

  const handleLogin = async () => {
    if (!id || !password) {
      Alert.alert('오류', '아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    
    try {
      // 백엔드 API 호출
      const response = await authAPI.login({
        username: id,
        password: password,
      });

      console.log('로그인 성공:', response);
      
      // 로그인 성공 시 메인 화면으로 이동
      navigation.navigate('Main');
      
    } catch (error) {
      console.error('로그인 실패:', error);
      Alert.alert('로그인 실패', error.message || '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleIdSubmit = () => {
    passwordInputRef.current?.focus();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="ID"
          value={id}
          onChangeText={setId}
          keyboardType="default"
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={handleIdSubmit}
          editable={!isLoading}
        />
        
        <TextInput
          ref={passwordInputRef}
          style={styles.input}
          placeholder="비밀번호"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleLogin}
          editable={!isLoading}
        />
      </View>

      <TouchableOpacity 
        style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.loginButtonText}>로그인</Text>
        )}
      </TouchableOpacity>

      {/* 개발용 정보 표시 */}
      {__DEV__ && (
        <View style={styles.devInfo}>
          <Text style={styles.devInfoText}>개발 모드</Text>
          <Text style={styles.devInfoText}>서버: localhost:8080</Text>
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  devInfo: {
    marginTop: 30,
    alignItems: 'center',
  },
  devInfoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
});

export default LoginScreen;