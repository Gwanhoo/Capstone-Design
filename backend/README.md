# Backend 실행/동작 확인 가이드

## 1) 설치
```bash
cd backend
npm install
cp .env.example .env
```

## 2) 서버 실행
```bash
npm run dev
```

정상 실행 시 아래 로그를 확인합니다.
- DB 연결 모드: `[DB] MongoDB connected`
- DB 생략 모드(`SKIP_DB=true`): `[DB] SKIP_DB=true, skipping MongoDB connection`
- 서버 시작: `[Server] listening on port 4000`

## 3) 동작 확인(Health Check)
별도 터미널에서:
```bash
curl http://localhost:4000/api/health
```

예상 응답:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

## 4) MongoDB 없이 빠른 스모크 테스트
`.env`에서 `SKIP_DB=true`로 설정하면 DB 연결 없이 API 라우팅/서버 기동 여부를 먼저 검증할 수 있습니다.
