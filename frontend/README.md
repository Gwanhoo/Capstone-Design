# Frontend 초기 세팅 방향 (React)

## 1) 추천 스택
- React + Vite
- 상태관리: Zustand 또는 Redux Toolkit
- 라우팅: React Router
- API 통신: Axios
- 실시간: Socket.io-client (추후)

## 2) 초기 실행
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install axios react-router-dom
```

## 3) 폴더 설계 원칙
- `features/` 중심으로 도메인 단위 분리 (boards, tasks, comments)
- 공용 UI/유틸은 `components/`, `utils/`에 위치
- 실시간 연결은 `sockets/`에서 단일 진입점으로 관리
- OpenAI 기반 UX(추천/요약)는 `services/aiApi.js`로 분리
