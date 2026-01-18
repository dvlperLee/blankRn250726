import axios from 'axios';
import { API_CONFIG, getApiUrl } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: getApiUrl(),
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// 요청 인터셉터 (요청 전에 실행)
apiClient.interceptors.request.use(
  (config) => {
    // 토큰이 있다면 헤더에 추가
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (응답 후에 실행)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 에러 (인증 실패) 시 토큰 제거
    if (error.response && error.response.status === 401) {
      removeStoredToken();
    }
    return Promise.reject(error);
  }
);

// 토큰 저장 (AsyncStorage 대신 간단한 메모리 저장 사용)
let authToken = null;

export const setStoredToken = (token) => {
  authToken = token;
  // 실제 앱에서는 AsyncStorage나 SecureStore 사용 권장
};

export const getStoredToken = () => {
  return authToken;
};

export const removeStoredToken = () => {
  authToken = null;
};

// 인증 관련 API
export const commonAPI = {
  // 로그인
  login: async (credentials) => {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, credentials);
      
      if (response.data.token) {
        setStoredToken(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // 컨테이너 번호 조회
  selectContainerNumber: async () => {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.SELECT_CONTAINERNUMBER);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // 컨테이너 번호 조회
  selectContainerNumberForBringOut: async () => {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.SELECT_CONTAINERNUMBER_FOR_BRING_OUT);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // 반입 등록
  import: async (importData) => {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.IMPORT, importData);     
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // 반출 등록
  export: async (exportData) => {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.EXPORT, exportData);     
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // 로그아웃
  logout: () => {
    removeStoredToken();
  },
};

// 사용자 관련 API
export const userAPI = {
  // 사용자 프로필 조회
  getProfile: async () => {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.USER_PROFILE);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // 사용자 프로필 업데이트
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put(API_CONFIG.ENDPOINTS.USER_PROFILE, profileData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// 에러 처리 함수
const handleApiError = (error) => {
  if (error.response) {
    // 서버에서 응답이 왔지만 에러 상태인 경우
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return new Error(data.message || '잘못된 요청입니다.');
      case 401:
        return new Error('인증이 필요합니다.');
      case 403:
        return new Error('접근 권한이 없습니다.');
      case 404:
        return new Error('요청한 리소스를 찾을 수 없습니다.');
      case 500:
        return new Error('서버 오류가 발생했습니다.');
      default:
        return new Error(data.message || '알 수 없는 오류가 발생했습니다.');
    }
  } else if (error.request) {
    // 요청은 보냈지만 응답을 받지 못한 경우
    return new Error('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
  } else {
    // 요청 자체를 보내지 못한 경우
    return new Error('요청을 처리할 수 없습니다.');
  }
};

export default apiClient;
