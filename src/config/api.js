// API 기본 설정
export const API_CONFIG = {
  // 개발 환경별 서버 URL
  DEV_URLS: {
    // 같은 Wi-Fi 네트워크 (에뮬레이터, 같은 네트워크의 핸드폰)
    LOCAL_NETWORK: 'http://172.30.1.7:7777/',
    // 외부에서 접근 가능한 공인 IP (포트포워딩 설정 필요)
    PUBLIC_IP: 'http://your-public-ip:7777/',
    // 터널링 서비스 (ngrok 등)
    TUNNEL: 'https://your-ngrok-url.ngrok.io/',
  },
  
  // 기본 개발 URL (현재 사용 중인 설정)
  BASE_URL: 'http://172.30.1.7:7777/',
  
  // 프로덕션 환경
  PRODUCTION_URL: 'https://your-production-server.com',
  
  // API 엔드포인트
  ENDPOINTS: {
    LOGIN: '/userMgmt/login',
    REGISTER: '/api/auth/register',
    USER_PROFILE: '/api/user/profile',
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
    // 개발 환경에서는 BASE_URL 사용 (172.30.1.7:7777)
    // 이는 같은 Wi-Fi 네트워크 내의 모든 기기에서 접근 가능
    return API_CONFIG.BASE_URL;
  }
  // 프로덕션 환경에서는 실제 서버 URL 사용
  return API_CONFIG.PRODUCTION_URL;
};

// 개발 환경에서 URL 변경 함수 (테스트용)
export const setDevUrl = (urlType) => {
  if (__DEV__ && API_CONFIG.DEV_URLS[urlType]) {
    API_CONFIG.BASE_URL = API_CONFIG.DEV_URLS[urlType];
    console.log(`개발 서버 URL이 ${API_CONFIG.DEV_URLS[urlType]}로 변경되었습니다.`);
  }
};

// 현재 사용 중인 URL 확인
export const getCurrentUrl = () => {
  return API_CONFIG.BASE_URL;
};
