# React Native + Java 백엔드 API 연동 가이드

## 개요
이 프로젝트는 React Native 앱과 Java Spring Boot 백엔드를 연동하여 PostgreSQL 데이터베이스에 접근하는 구조입니다.

## 프로젝트 구조
```
src/
├── config/
│   └── api.js          # API 설정 및 환경 변수
├── services/
│   └── apiService.js   # API 통신 서비스
└── screens/
    └── Login.js        # 로그인 화면 (API 연동 완료)
```

## 백엔드 요구사항

### 1. Java Spring Boot 서버 설정
- **포트**: 7777 (현재 설정)
- **데이터베이스**: PostgreSQL
- **JWT 인증**: Bearer 토큰 방식

### 2. 필수 API 엔드포인트

#### 로그인 API
```
POST /userMgmt/login
Content-Type: application/json

Request Body:
{
  "username": "사용자ID",
  "password": "비밀번호"
}

Response:
{
  "success": true,
  "token": "JWT_TOKEN_STRING",
  "user": {
    "id": 1,
    "username": "사용자ID",
    "email": "user@example.com"
  }
}
```

#### 회원가입 API
```
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "username": "사용자ID",
  "password": "비밀번호",
  "email": "user@example.com"
}
```

#### 사용자 프로필 API
```
GET /api/user/profile
Authorization: Bearer {JWT_TOKEN}

Response:
{
  "id": 1,
  "username": "사용자ID",
  "email": "user@example.com",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## 환경 설정

### 1. 개발 환경 - 핸드폰 접근 방법

#### 방법 1: 같은 Wi-Fi 네트워크 (권장)
- **설정**: `http://172.30.1.7:7777/` (현재 설정)
- **장점**: 간단하고 빠름
- **사용법**: 
  - 핸드폰과 개발 PC를 같은 Wi-Fi에 연결
  - 핸드폰에서 `172.30.1.7:7777`로 접근
- **확인 방법**: 핸드폰 브라우저에서 `http://172.30.1.7:7777` 접속 테스트

#### 방법 2: 공인 IP + 포트포워딩
- **설정**: `http://your-public-ip:7777/`
- **장점**: 어디서든 접근 가능
- **사용법**:
  - 공유기에서 포트포워딩 설정 (외부:7777 → 내부:172.30.1.7:7777)
  - 공인 IP 확인: `whatismyipaddress.com`
- **주의사항**: 보안상 개발 환경에서만 사용

#### 방법 3: 터널링 서비스 (ngrok)
- **설정**: `https://your-ngrok-url.ngrok.io/`
- **장점**: 간단한 설정, HTTPS 지원
- **사용법**:
  ```bash
  # ngrok 설치 후
  ngrok http 7777
  ```
- **주의사항**: 무료 버전은 세션 제한

### 2. 환경별 URL 설정

```javascript
// src/config/api.js에서 환경별 URL 설정
DEV_URLS: {
  LOCAL_NETWORK: 'http://172.30.1.7:7777/',    // 같은 Wi-Fi
  PUBLIC_IP: 'http://your-public-ip:7777/',     // 외부 접근
  TUNNEL: 'https://your-ngrok-url.ngrok.io/',   // 터널링
}
```

### 3. 프로덕션 환경
- `src/config/api.js`에서 `PRODUCTION_URL`을 실제 서버 URL로 변경
- HTTPS 사용 권장

## 핸드폰에서 서버 접근 테스트

### 1. 같은 Wi-Fi 네트워크 테스트
```bash
# 개발 PC에서 IP 확인
ipconfig (Windows) 또는 ifconfig (Mac/Linux)

# 핸드폰 브라우저에서 테스트
http://172.30.1.7:7777
```

### 2. 포트포워딩 설정 (공유기별)
- **공유기 관리자 페이지** 접속 (보통 192.168.1.1)
- **포트포워딩** 또는 **Port Forwarding** 메뉴
- **외부 포트**: 7777, **내부 IP**: 172.30.1.7, **내부 포트**: 7777

### 3. ngrok 터널링 설정
```bash
# 1. ngrok 설치
npm install -g ngrok

# 2. 터널 생성
ngrok http 7777

# 3. 제공된 URL을 api.js에 설정
# 예: https://abc123.ngrok.io/
```

## 사용 방법

### 1. 로그인
```javascript
import { authAPI } from '../services/apiService';

try {
  const response = await authAPI.login({
    username: 'user123',
    password: 'password123'
  });
  console.log('로그인 성공:', response);
} catch (error) {
  console.error('로그인 실패:', error.message);
}
```

### 2. 사용자 프로필 조회
```javascript
import { userAPI } from '../services/apiService';

try {
  const profile = await userAPI.getProfile();
  console.log('프로필:', profile);
} catch (error) {
  console.error('프로필 조회 실패:', error.message);
}
```

### 3. 로그아웃
```javascript
import { authAPI } from '../services/apiService';

authAPI.logout();
```

### 4. 개발 환경에서 URL 변경 (테스트용)
```javascript
import { setDevUrl } from '../config/api';

// 터널링 URL로 변경
setDevUrl('TUNNEL');

// 공인 IP로 변경
setDevUrl('PUBLIC_IP');
```

## 보안 고려사항

### 1. 토큰 저장
- 현재는 메모리에 저장 (앱 재시작 시 사라짐)
- 프로덕션에서는 `@react-native-async-storage/async-storage` 또는 `expo-secure-store` 사용 권장

### 2. HTTPS
- 프로덕션 환경에서는 반드시 HTTPS 사용
- 자체 서명 인증서는 개발 환경에서만 사용

### 3. 토큰 만료
- JWT 토큰의 만료 시간 설정
- 리프레시 토큰 구현 고려

### 4. 개발 환경 보안
- 포트포워딩은 개발 중에만 사용
- ngrok 사용 시 HTTPS 자동 적용
- 방화벽 설정으로 불필요한 포트 차단

## 에러 처리

### HTTP 상태 코드별 처리
- **400**: 잘못된 요청
- **401**: 인증 실패 (토큰 만료/무효)
- **403**: 접근 권한 없음
- **404**: 리소스 없음
- **500**: 서버 오류

### 네트워크 오류
- 인터넷 연결 상태 확인
- 서버 연결 실패 시 사용자에게 명확한 메시지 제공
- 핸드폰과 서버 간 네트워크 연결 상태 확인

## 개발 팁

### 1. 디버깅
- 개발 모드에서 서버 정보 표시
- `console.log`로 API 응답 확인
- React Native Debugger 사용
- 핸드폰에서 네트워크 상태 확인

### 2. 테스트
- 백엔드 API가 실행 중인지 확인
- Postman 등으로 API 테스트
- 핸드폰 브라우저로 서버 접근 테스트
- 다른 Wi-Fi 네트워크에서 접근 테스트

### 3. 성능 최적화
- API 응답 캐싱
- 이미지 압축 및 최적화
- 불필요한 API 호출 최소화

## 문제 해결

### 1. 연결 실패
- 백엔드 서버 실행 상태 확인
- 방화벽 설정 확인
- 포트 번호 확인
- Wi-Fi 네트워크 연결 상태 확인

### 2. CORS 오류
- 백엔드에서 CORS 설정 확인
- 허용된 도메인 설정
- 모든 IP에서 접근 허용 (개발 환경)

### 3. 인증 오류
- JWT 토큰 형식 확인
- 토큰 만료 시간 확인
- 백엔드 인증 로직 확인

### 4. 핸드폰 접근 문제
- **같은 Wi-Fi**: IP 주소 확인, 방화벽 설정
- **외부 접근**: 포트포워딩 설정, 공인 IP 확인
- **터널링**: ngrok 세션 만료 확인, URL 재생성

## 추가 기능 구현

### 1. 자동 로그인
- 토큰 유효성 검사
- 자동 토큰 갱신

### 2. 오프라인 지원
- 로컬 데이터 저장
- 동기화 기능

### 3. 푸시 알림
- FCM 설정
- 백엔드 푸시 서비스 연동

### 4. 네트워크 상태 모니터링
- Wi-Fi 연결 상태 확인
- 서버 접근 가능 여부 확인
- 자동 URL 전환

### 5. 빌드
- cd android
- ./gradlew clean assembleRelease