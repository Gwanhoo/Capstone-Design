import { ChatMessage, KanbanColumnType, Task } from "./types";

export const initialTasks: Record<string, Task> = {
  "task-1": {
    id: "task-1",
    title: "실시간 협업 편집 충돌 처리 개선",
    description: "OT 기반 충돌 해결 로직을 정제하고 편집 지연 구간을 120ms 이하로 최적화합니다.",
    assignee: "이민지",
    assigneeInitial: "LM",
    progress: 82,
    comments: 18,
    attachments: 4,
    dueDate: "2026.05.14",
    aiStatus: "AI 위험도 낮음",
    priority: "긴급"
  },
  "task-2": {
    id: "task-2",
    title: "AI 작업 추천 규칙 튜닝",
    description: "스프린트 히스토리를 기반으로 우선순위 모델 가중치를 재학습합니다.",
    assignee: "김도윤",
    assigneeInitial: "KD",
    progress: 46,
    comments: 7,
    attachments: 2,
    dueDate: "2026.05.16",
    aiStatus: "AI 분석 중",
    priority: "높음"
  },
  "task-3": {
    id: "task-3",
    title: "대시보드 지표 위젯 반응형 정리",
    description: "모바일/태블릿 브레이크포인트에서 카드 정렬과 타이포 밸런스를 정리합니다.",
    assignee: "박서연",
    assigneeInitial: "PS",
    progress: 28,
    comments: 5,
    attachments: 1,
    dueDate: "2026.05.18",
    aiStatus: "AI 리뷰 대기",
    priority: "보통"
  },
  "task-4": {
    id: "task-4",
    title: "백로그 태그 자동 분류 적용",
    description: "채팅/문서에서 추출한 키워드를 기반으로 백로그 태그를 자동 배치합니다.",
    assignee: "정민호",
    assigneeInitial: "JM",
    progress: 100,
    comments: 12,
    attachments: 6,
    dueDate: "2026.05.10",
    aiStatus: "AI 검증 완료",
    priority: "낮음"
  }
};

export const initialColumns: KanbanColumnType[] = [
  { id: "todo", title: "할 일", tone: "slate", taskIds: ["task-2", "task-3"] },
  { id: "in-progress", title: "진행 중", tone: "primary", taskIds: ["task-1"] },
  { id: "done", title: "완료", tone: "tertiary", taskIds: ["task-4"] }
];

export const initialMessages: ChatMessage[] = [
  { id: "msg-1", sender: "이민지", time: "오후 2:30", message: "API 연동 스펙 문서 업데이트 완료했습니다. 리뷰 부탁드려요!", type: "team" },
  { id: "msg-2", sender: "나", time: "오후 2:31", message: "확인할게요. 백로그 우선순위도 같이 맞춰보겠습니다.", type: "mine" },
  { id: "msg-3", sender: "AI 어시스턴트", time: "오후 2:33", message: "채팅 내용을 분석하여 'API 연동 확인' 업무를 백로그에 추가할까요?", type: "ai" }
];
