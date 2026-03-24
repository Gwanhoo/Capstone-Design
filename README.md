# AI 기반 실시간 협업 칸반 시스템

## 1. Overview

본 프로젝트는 프로젝트 초기 단계에서 업무 분장과 협업에 어려움을 겪는 개발자 및 소규모 팀을 위해 설계된 AI 기반 실시간 협업 칸반 시스템이다.

사용자가 프로젝트 목표를 입력하면 LLM(OpenAI API)이 이를 분석하여 세부 태스크를 자동 생성하고, WebSocket을 통해 팀원 간 실시간 협업을 지원한다.

---

## 2. Key Features

* AI 기반 태스크 자동 분해 (Task Decomposition)
* 칸반 보드 기반 작업 관리 (ToDo / InProgress / Done)
* WebSocket 기반 실시간 데이터 동기화
* 드래그 앤 드롭 기반 태스크 상태 변경
* 다중 사용자 협업 지원

---

## 3. System Architecture

* Frontend: React / Next.js
* Backend: Node.js (Express)
* Database: MongoDB
* Realtime Communication: Socket.io
* AI Processing: OpenAI API

---

## 4. Requirements Definition

### 4.1 Functional Requirements

| ID    | Name      | Description                                                    | Priority | Note         |
| ----- | --------- | -------------------------------------------------------------- | -------- | ------------ |
| F-001 | 프로젝트 생성   | 사용자는 프로젝트 이름과 설명을 입력하여 새로운 협업 프로젝트를 생성할 수 있어야 한다               | High     | 로그인 사용자만 가능  |
| F-002 | 태스크 자동 생성 | 사용자가 프로젝트 목표를 입력하면 LLM(OpenAI API)이 이를 분석하여 세부 태스크를 자동 생성해야 한다 | High     | API 응답 지연 가능 |
| F-003 | 칸반 보드 생성  | 생성된 태스크는 ToDo / InProgress / Done 형태의 칸반 보드로 자동 배치되어야 한다       | High     | 기본 3단 구조     |
| F-004 | 태스크 CRUD  | 사용자는 태스크를 생성, 수정, 삭제할 수 있어야 한다                                 | High     | 권한 체크 필요     |
| F-005 | 태스크 상태 변경 | 사용자는 드래그 앤 드롭으로 태스크 상태를 변경할 수 있어야 한다                           | High     | UI 반응성 중요    |
| F-006 | 실시간 동기화   | 변경 사항이 모든 사용자에게 실시간으로 반영되어야 한다                                 | High     | Socket.io 사용 |
| F-007 | 사용자 참여    | 사용자는 프로젝트에 참여할 수 있어야 한다                                        | Medium   | 향후 확장 가능     |
| F-008 | 활동 로그 기록  | 사용자 활동 로그를 저장해야 한다                                             | Medium   | DB 저장 필요     |

---

### 4.2 Non-Functional Requirements

| ID    | Name      | Description                          | Priority | Note          |
| ----- | --------- | ------------------------------------ | -------- | ------------- |
| N-001 | 실시간 처리 성능 | 동시 사용자 50명 이상 접속 시에도 지연 없이 동기화되어야 한다 | High     | WebSocket 최적화 |
| N-002 | 응답 시간     | 일반 API는 2초 이내, AI 응답은 5초 이내          | High     | OpenAI 의존     |
| N-003 | 보안        | JWT 기반 인증을 적용해야 한다                   | High     | 로그인 필수        |
| N-004 | 데이터 일관성   | 동시 수정 시 데이터 충돌이 없어야 한다               | High     | Version 관리 필요 |
| N-005 | 확장성       | 사용자 증가에 따른 확장이 가능해야 한다               | Medium   | Redis 고려      |
| N-006 | 안정성       | 서버 장애 시에도 서비스 유지                     | Medium   | 예외 처리         |
| N-007 | 사용성       | 직관적인 UI 제공                           | Medium   | UX 중요         |

---

### 4.3 Data Requirements

| ID    | Name     | Description          | Priority | Note     |
| ----- | -------- | -------------------- | -------- | -------- |
| D-001 | 프로젝트 데이터 | 프로젝트 정보를 DB에 저장해야 한다 | High     | MongoDB  |
| D-002 | 태스크 데이터  | 태스크 상태 및 내용 저장       | High     | NoSQL 구조 |
| D-003 | 로그 데이터   | 사용자 활동 기록 저장         | Medium   | 로그 관리 필요 |

---

## 5. Project Structure

```
backend/     : 서버 및 API
frontend/    : 사용자 인터페이스
docs/        : 요구사항 및 설계 문서
```

---

## 6. Execution Guide

각 모듈의 실행 방법은 다음 문서를 참고한다.

* backend/README.md
* frontend/README.md
