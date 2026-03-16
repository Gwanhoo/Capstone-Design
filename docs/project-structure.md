# AI 기반 실시간 협업 칸반 시스템 기본 구조

## 전체 폴더 구조
```text
Capstone-Design/
├─ backend/
│  ├─ .env.example
│  ├─ README.md
│  ├─ package.json
│  └─ src/
│     ├─ app.js
│     ├─ server.js
│     ├─ config/
│     │  ├─ env.js
│     │  └─ db.js
│     ├─ controllers/
│     │  └─ health.controller.js
│     ├─ routes/
│     │  └─ index.js
│     ├─ middlewares/
│     ├─ models/
│     ├─ services/
│     │  └─ openai.service.js
│     ├─ sockets/
│     │  └─ index.js
│     └─ utils/
├─ frontend/
│  ├─ README.md
│  └─ src/
│     ├─ app/
│     ├─ components/
│     ├─ features/
│     ├─ hooks/
│     ├─ layouts/
│     ├─ pages/
│     ├─ services/
│     ├─ sockets/
│     ├─ state/
│     ├─ styles/
│     └─ utils/
└─ docs/
   └─ project-structure.md
```

## 폴더/파일 역할
- `backend/README.md`: 백엔드 실행/헬스체크 절차 안내.
- `backend/src/server.js`: 서버 실행 진입점. HTTP 서버 생성 후 DB 연결/리스닝 처리.
- `backend/src/app.js`: Express 앱 구성(미들웨어/라우터 등록).
- `backend/src/config/env.js`: 환경변수 로딩 및 필수값 검증.
- `backend/src/config/db.js`: MongoDB(Mongoose) 연결 설정.
- `backend/src/routes/index.js`: API 라우트 집합.
- `backend/src/controllers/`: 요청/응답 처리 로직.
- `backend/src/models/`: Mongoose 스키마/모델 정의.
- `backend/src/services/`: 비즈니스 로직/외부 API(OpenAI 포함) 연동.
- `backend/src/sockets/`: Socket.io 이벤트 등록 및 실시간 협업 로직.
- `frontend/src/features/`: 도메인 단위 UI/상태/비즈니스 로직.
- `frontend/src/services/`: 백엔드 API 및 AI API 호출 레이어.
- `frontend/src/sockets/`: Socket.io client 관리 레이어.

## 확장성 관점
- HTTP 서버 인스턴스를 분리해 `Socket.io` 부착이 쉬움.
- `SKIP_DB` 플래그로 DB 의존성을 분리해 API 스모크 테스트를 빠르게 수행 가능.
- `services/`를 분리해 OpenAI API를 컨트롤러에서 직접 호출하지 않도록 구조화.
- 환경변수를 중앙(`config/env.js`)에서 검증해 배포 환경 안정성을 높임.
- 프론트엔드는 `features/` 기반 구조로 기능 단위 병렬 개발이 용이함.
