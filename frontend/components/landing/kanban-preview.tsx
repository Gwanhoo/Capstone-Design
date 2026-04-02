import { Bot, CalendarDays, MessageSquareText, Sparkles } from "lucide-react";

type Status = "todo" | "inProgress" | "done";
type Priority = "P0" | "P1" | "P2";

type Task = {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  tag: string;
  progress: number;
  priority: Priority;
  status: Status;
};

const tasks: Task[] = [
  {
    id: "t1",
    title: "OAuth 팀 워크스페이스 권한 모델 정리",
    assignee: "SK",
    dueDate: "4월 3일",
    tag: "Auth",
    progress: 25,
    priority: "P0",
    status: "todo",
  },
  {
    id: "t2",
    title: "칸반 카드 댓글 이벤트 브로드캐스트",
    assignee: "JD",
    dueDate: "4월 5일",
    tag: "Socket",
    progress: 40,
    priority: "P1",
    status: "todo",
  },
  {
    id: "t3",
    title: "AI task decomposition prompt tuning",
    assignee: "AL",
    dueDate: "오늘",
    tag: "AI",
    progress: 72,
    priority: "P0",
    status: "inProgress",
  },
  {
    id: "t4",
    title: "보드 성능 프로파일링 리포트",
    assignee: "MN",
    dueDate: "4월 6일",
    tag: "Perf",
    progress: 58,
    priority: "P1",
    status: "inProgress",
  },
  {
    id: "t5",
    title: "프로젝트 온보딩 플로우 정리",
    assignee: "HJ",
    dueDate: "완료",
    tag: "UX",
    progress: 100,
    priority: "P2",
    status: "done",
  },
];

const statusMeta: Record<Status, { label: string; tone: string }> = {
  todo: { label: "Todo", tone: "text-[#918fa1]" },
  inProgress: { label: "In Progress", tone: "text-[#c3c0ff]" },
  done: { label: "Done", tone: "text-[#4cd6ff]" },
};

const priorityTone: Record<Priority, string> = {
  P0: "bg-[#ffb4ab]/15 text-[#ffb4ab]",
  P1: "bg-[#c3c0ff]/15 text-[#c3c0ff]",
  P2: "bg-[#4cd6ff]/15 text-[#4cd6ff]",
};

const chatLog = [
  {
    sender: "Alex (AI)",
    message: "인증 관련 병목을 감지했어요. OAuth와 Role matrix를 분리할까요?",
    ai: true,
  },
  {
    sender: "Sarah",
    message: "좋아요. OAuth는 오늘 머지 목표로 태스크 생성해주세요.",
    ai: false,
  },
];

function TaskCard({ task }: { task: Task }) {
  return (
    <article className="rounded-lg bg-[#1c1b1b] p-3 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#201f1f]">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium leading-snug text-[#e5e2e1]">{task.title}</h4>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${priorityTone[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      <div className="mb-3 flex items-center gap-2 text-[11px] text-[#c7c4d8]">
        <span className="rounded-full bg-[#2a2a2a] px-2 py-0.5">{task.tag}</span>
        <span className="inline-flex items-center gap-1 text-[#918fa1]">
          <CalendarDays className="h-3.5 w-3.5" />
          {task.dueDate}
        </span>
      </div>

      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-[#0e0e0e]">
        <div className="h-full rounded-full bg-[#4f46e5]" style={{ width: `${task.progress}%` }} />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[11px] text-[#918fa1]">담당자</span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#353534] text-[10px] font-semibold text-[#e5e2e1]">
          {task.assignee}
        </span>
      </div>
    </article>
  );
}

export function KanbanPreview() {
  const grouped = {
    todo: tasks.filter((task) => task.status === "todo"),
    inProgress: tasks.filter((task) => task.status === "inProgress"),
    done: tasks.filter((task) => task.status === "done"),
  };

  return (
    <section className="px-6 py-24 md:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 rounded-2xl bg-[#0e0e0e] p-5 md:p-7 lg:flex-row">
        <div className="flex-1 space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-[#918fa1]">Live Workspace</p>
              <h2 className="text-2xl font-semibold tracking-tight text-[#e5e2e1]">실시간 협업 칸반 미리보기</h2>
            </div>
            <span className="text-xs text-[#4cd6ff]">Sync 80ms</span>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {(Object.keys(grouped) as Status[]).map((status) => (
              <div key={status} className="space-y-3 rounded-xl bg-[#131313] p-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold uppercase tracking-[0.12em] ${statusMeta[status].tone}`}>
                    {statusMeta[status].label}
                  </span>
                  <span className="rounded bg-[#1c1b1b] px-2 py-0.5 text-[11px] text-[#918fa1]">
                    {grouped[status].length}
                  </span>
                </div>

                {status === "inProgress" && (
                  <div className="rounded-lg bg-[#2a2a2a]/80 p-3 shadow-[0_4px_24px_rgba(0,0,0,0.4),0_2px_8px_rgba(79,70,229,0.08)] backdrop-blur-xl">
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-[#c3c0ff]">
                      <Bot className="h-3.5 w-3.5" />
                      AI 분석 제안
                    </div>
                    <p className="text-[12px] leading-relaxed text-[#c7c4d8]">
                      현재 작업량 기준으로 API 문서화를 다음 스프린트로 이관하면 완료율이 14% 개선될 수 있습니다.
                    </p>
                  </div>
                )}

                {grouped[status].map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ))}
          </div>
        </div>

        <aside className="w-full rounded-xl bg-[#131313] p-4 lg:w-80">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#e5e2e1]">팀 채팅</h3>
            <span className="inline-flex items-center gap-1 text-xs text-[#4cd6ff]">
              <Sparkles className="h-3.5 w-3.5" />
              Live
            </span>
          </div>

          <div className="space-y-3">
            {chatLog.map((chat) => (
              <div
                key={chat.message}
                className={`rounded-lg p-3 text-xs leading-relaxed ${
                  chat.ai ? "bg-[#2a2a2a] text-[#c7c4d8]" : "bg-[#1c1b1b] text-[#e5e2e1]"
                }`}
              >
                <p className="mb-1 text-[11px] font-semibold text-[#918fa1]">{chat.sender}</p>
                <p>{chat.message}</p>
              </div>
            ))}
          </div>

          <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#1c1b1b] px-3 py-2 text-xs font-medium text-[#c3c0ff] transition-colors hover:bg-[#2a2a2a]">
            <MessageSquareText className="h-3.5 w-3.5" />
            AI에게 다음 액션 추천받기
          </button>
        </aside>
      </div>
    </section>
  );
}
