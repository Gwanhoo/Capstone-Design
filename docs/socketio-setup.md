# Socket.io 설치 및 실행 가이드

## 1) npm registry 확인
```bash
npm config get registry
```

정상 값 예시:
- `https://registry.npmjs.org/`

## 2) registry 기본값으로 변경
사내 미러/프록시 정책으로 설치가 막히는 경우 아래 명령으로 기본 레지스트리로 복구합니다.

```bash
npm config set registry https://registry.npmjs.org/
```

필요 시 프록시도 점검합니다.

```bash
npm config get proxy
npm config get https-proxy
```

## 3) 의존성 설치
백엔드와 프론트를 각각 설치합니다.

```bash
cd backend
npm install

cd ../frontend
npm install
```

## 4) 실행 순서
터미널 1:
```bash
cd backend
npm run dev
```

터미널 2:
```bash
cd frontend
npm run dev
```

## 5) Socket 테스트 방법
1. 서로 다른 계정 A/B로 로그인합니다.
2. 같은 프로젝트 보드(`/projects/:projectId/board`)에 접속합니다.
3. A에서 태스크 생성/수정/삭제/이동을 수행합니다.
4. B 화면에서 아래 이벤트가 즉시 반영되는지 확인합니다.
   - `task:created`
   - `task:updated`
   - `task:deleted`
   - `task:moved`

## 6) 현재 저장소의 타입 선언 파일 안내
- `frontend/types/socket-io-client.d.ts`는 **설치 제한 환경(예: npm 403)** 에서도 `tsc`가 깨지지 않도록 둔 안전장치입니다.
- 일반 개발 환경에서 `socket.io-client` 설치가 정상 완료되면 패키지가 자체 타입을 제공하므로 제거를 검토할 수 있습니다.
