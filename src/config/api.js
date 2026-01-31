import { Platform } from 'react-native';

// 플랫폼별 기본 URL 결정
const getDefaultBaseUrl = () => {
  if (__DEV__) {
    // 모든 플랫폼에서 172.30.1.7 사용
    return 'http://192.168.0.176:7777/';
  }
  return 'http://192.168.0.176:7777/';
};

// API 기본 설정
export const API_CONFIG = {
  // 개발 환경별 서버 URL
  DEV_URLS: {
    // Android 에뮬레이터용
    ANDROID_EMULATOR: 'http://192.168.1.176:7777/',
    // 실제 기기용
    REAL_DEVICE: 'http://192.168.1.176:7777/',
    // iOS 시뮬레이터용
    IOS_SIMULATOR: 'http://172.30.1.7:7777/',
    // 외부에서 접근 가능한 공인 IP (포트포워딩 설정 필요)
    PUBLIC_IP: 'http://172.30.1.7:7777/',
    // 터널링 서비스 (ngrok 등)
    TUNNEL: 'https://your-ngrok-url.ngrok.io/',
  },

  // 기본 개발 URL (플랫폼별로 자동 설정)
  BASE_URL: getDefaultBaseUrl(),

  // 프로덕션 환경
  PRODUCTION_URL: getDefaultBaseUrl(),

  // API 엔드포인트
  ENDPOINTS: {
    LOGIN: '/userMgmt/login',
    SELECT_CONTAINERNUMBER: '/reCtrl/selectConNumber',
    SELECT_CONTAINERNUMBER_FOR_BRING_OUT: '/reCtrl/selectConNumberForBringOut',
    IMPORT: '/reCtrl/updateBringInContainer',
    EXPORT: '/reCtrl/updateBringOutContainer',
    SELECT_HISTORY: '/reCtrl/selectHistory',
    SELECT_IMPORT_MGMT: '/reCtrl/selectImportMgmt',
    UPDATE_IMPORT_MGMT: '/reCtrl/updateImportMgmt',
    SELECT_EXPORT_MGMT: '/reCtrl/selectExportMgmt',
    UPDATE_EXPORT_MGMT: '/reCtrl/updateExportMgmt',
    //USER_PROFILE: '/api/user/profile',
    // 필요한 다른 엔드포인트들을 여기에 추가
  },

  // HTTP 헤더 기본 설정
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },

  // 타임아웃 설정 (밀리초)
  TIMEOUT: 10000,
};

// 환경별 설정
export const getApiUrl = () => {
  // __DEV__는 React Native에서 개발 모드인지 확인하는 전역 변수
  if (__DEV__) {
    // 개발 환경에서는 BASE_URL 사용
    const url = API_CONFIG.BASE_URL;
    return url;
  }
  // 프로덕션 환경에서는 실제 서버 URL 사용
  return API_CONFIG.PRODUCTION_URL;
};

// 네트워크 연결 확인 및 URL 검증
export const verifyNetworkConnection = async (testUrl = null) => {
  const urlToTest = testUrl || getApiUrl();

  try {

    // 간단한 연결 테스트를 위해 fetch 사용
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(urlToTest, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (response.ok || response.status < 500) {
      return { success: true, url: urlToTest, status: response.status };
    } else {
      return { success: false, url: urlToTest, status: response.status, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    clearTimeout(timeoutId);
    const currentUrl = getApiUrl();

    let errorDetails = {
      success: false,
      url: urlToTest,
      error: error.message,
      code: error.code || error.name,
    };

    return errorDetails;
  }
};

// 여러 URL을 테스트하는 함수
export const testMultipleUrls = async () => {
  const urlsToTest = [];

  // 모든 플랫폼에서 172.30.1.7 사용
  urlsToTest.push('http://172.30.1.7:7777/');

  const results = [];

  for (const url of urlsToTest) {
    const result = await verifyNetworkConnection(url);
    results.push(result);

    if (result.success) {
      // 첫 번째 성공한 URL로 설정
      setCustomUrl(url);
      break;
    } else {
    }

    // 각 테스트 사이에 짧은 대기
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return results;
};

// 개발 환경에서 URL 변경 함수 (테스트용)
export const setDevUrl = (urlType) => {
  if (__DEV__ && API_CONFIG.DEV_URLS[urlType]) {
    API_CONFIG.BASE_URL = API_CONFIG.DEV_URLS[urlType];

    // axios 인스턴스의 baseURL도 업데이트
    if (typeof updateApiClientBaseURL === 'function') {
      updateApiClientBaseURL();
    }
  } else {
  }
};

// 수동으로 URL 설정 (IP 주소 직접 입력)
export const setCustomUrl = (url) => {
  if (__DEV__) {
    // URL 형식 검증
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      API_CONFIG.BASE_URL = url.endsWith('/') ? url : url + '/';

      // axios 인스턴스의 baseURL도 업데이트
      if (typeof updateApiClientBaseURL === 'function') {
        updateApiClientBaseURL();
      }
    } else {
    }
  }
};

// axios baseURL 업데이트 함수를 export (apiService에서 사용)
export let updateApiClientBaseURL = null;
export const setUpdateApiClientBaseURL = (fn) => {
  updateApiClientBaseURL = fn;
};

// 현재 사용 중인 URL 확인
export const getCurrentUrl = () => {
  return API_CONFIG.BASE_URL;
};
