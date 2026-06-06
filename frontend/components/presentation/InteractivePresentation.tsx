"use client";

import Link from "next/link";
import { DragEvent, FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  Bell,
  Bot,
  Braces,
  CheckCircle2,
  ChevronRight,
  Database,
  GitBranch,
  Layers3,
  MessageSquareText,
  Network,
  Plus,
  RefreshCcw,
  Sparkles,
  Users,
  Workflow,
  Zap
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { KanbanColumnType, Task } from "@/components/kanban/types";

type PresentationLog = {
  id: string;
  label: string;
  detail: string;
  tone: "primary" | "tertiary" | "success";
};

type FeatureCard = {
  title: string;
  description: string;
  icon: ReactNode;
};

type DemoChatMessage = {
  id: string;
  author: "PM" | "FE" | "BE" | "나" | "AI";
  text: string;
  tone: "team" | "mine" | "ai";
};

const baseLogs: PresentationLog[] = [
  { id: "log-ready", label: "발표 모드 준비 완료", detail: "발표 전용 mock state로 실행 중", tone: "primary" },
  { id: "log-sync", label: "실시간 협업 흐름 대기", detail: "카드, 채팅, 메모, AI 이벤트를 로그로 시각화", tone: "tertiary" }
];

const features: FeatureCard[] = [
  { title: "칸반 카드 생성", description: "새 작업과 AI 분해 결과를 보드에 추가", icon: <Plus className="h-5 w-5" /> },
  { title: "드래그 앤 드롭", description: "카드를 이동하며 진행 상태를 즉시 변경", icon: <GripVertical className="h-5 w-5" /> },
  { title: "팀 채팅", description: "프로젝트 맥락을 공유하는 compact 채팅", icon: <MessageSquareText className="h-5 w-5" /> },
  { title: "AI 작업 분해", description: "프롬프트를 실행 가능한 Task로 전환", icon: <Bot className="h-5 w-5" /> },
  { title: "AI 보드 분석", description: "진행률, 병목, 추천 액션을 요약", icon: <Sparkles className="h-5 w-5" /> },
  { title: "메모 & AI 요약", description: "회의·이슈 메모에서 핵심 맥락 추출", icon: <Bell className="h-5 w-5" /> }
];

const techStacks = [
  { group: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind"] },
  { group: "Backend", items: ["Node.js", "Express"] },
  { group: "Database", items: ["MongoDB"] },
  { group: "Realtime", items: ["Socket.io"] },
  { group: "AI", items: ["OpenAI API"] }
];

const demoMemos = [
  "프로젝트 초대 수락 플로우 UX 개선 필요",
  "칸반 카드 이동 시 WebSocket 동기화 정상 작동",
  "AI 작업 분할 결과를 사용자가 수정할 수 있도록 개선 예정",
  "발표 전 프로젝트 보관 기능과 메모 요약 기능 정리"
];

const demoMemoSummary = `실시간 협업과 칸반 카드 동기화는 안정화된 상태입니다.
초대 UX, AI 작업 분할 수정, 프로젝트 보관 기능 개선이 남았습니다.
발표에서는 메모 요약과 AI 보드 분석을 핵심 시연으로 연결하는 것이 좋습니다.`;

const architectureNodes = [
  { label: "Frontend", detail: "Next.js / React", icon: <Workflow className="h-5 w-5" /> },
  { label: "Backend", detail: "Node.js / Express", icon: <Braces className="h-5 w-5" /> },
  { label: "MongoDB", detail: "Project · Task · Chat · Memo", icon: <Database className="h-5 w-5" /> },
  { label: "Socket.io", detail: "Realtime Sync", icon: <Network className="h-5 w-5" /> },
  { label: "OpenAI API", detail: "Task · Board · Memo AI", icon: <Sparkles className="h-5 w-5" /> }
];

const initialColumns: KanbanColumnType[] = [
  { id: "todo", title: "할 일", tone: "slate", taskIds: ["task-presentation", "task-ai", "task-deploy"] },
  { id: "doing", title: "진행 중", tone: "primary", taskIds: ["task-memo"] },
  { id: "done", title: "완료", tone: "tertiary", taskIds: ["task-chat"] }
];

const initialTasks: Task[] = [
  createPresentationTask("task-presentation", "발표 자료 정리", "todo", 0, "발표 흐름과 핵심 시연 순서를 정리합니다.", "높음", 15),
  createPresentationTask("task-ai", "AI 작업 분해 테스트", "todo", 1, "프롬프트 기반 Task 생성 흐름을 검증합니다.", "높음", 10),
  createPresentationTask("task-deploy", "배포 URL 점검", "todo", 2, "발표 전 접속 URL과 환경 변수를 확인합니다.", "보통", 0),
  createPresentationTask("task-memo", "메모 요약 기능 정리", "doing", 0, "프로젝트 메모와 AI 요약 시연 문구를 준비합니다.", "높음", 55),
  createPresentationTask("task-chat", "팀 채팅 테스트", "done", 0, "mock 메시지 송수신 흐름을 발표 페이지에서 확인합니다.", "보통", 100)
];

const initialChatMessages: DemoChatMessage[] = [
  { id: "chat-pm", author: "PM", text: "발표 전 배포 URL 한 번 더 확인해주세요.", tone: "team" },
  { id: "chat-fe", author: "FE", text: "AI 통합 시연 화면 정리 완료했습니다.", tone: "team" },
  { id: "chat-be", author: "BE", text: "메모 요약 API는 mock 시연으로 처리하겠습니다.", tone: "team" }
];

const initialMemos = [
  "로그인 이후 프로젝트 초대 수락 플로우에서 UX 개선 필요",
  "칸반 카드 이동 시 WebSocket 동기화 정상 작동",
  "AI 작업 분할 결과를 사용자가 수정할 수 있도록 개선 예정"
];

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} transition duration-1000 ease-out ${visible ? "translate-y-0 opacity-100 blur-0" : "translate-y-12 opacity-0 blur-sm"}`}
    >
      {children}
    </div>
  );
}

function createPresentationTask(
  id: string,
  title: string,
  columnId: string,
  order: number,
  description = "발표용 mock 칸반 카드입니다.",
  priority: Task["priority"] = "보통",
  progress = 0,
  aiStatus = "수동 생성 작업"
): Task {
  return {
    id,
    columnId,
    order,
    title,
    description,
    assignee: "발표자",
    assigneeInitial: "PR",
    progress,
    dueDate: "발표 일정",
    aiStatus,
    priority
  };
}

const createInitialTaskMap = () => initialTasks.reduce<Record<string, Task>>((acc, task) => ({ ...acc, [task.id]: task }), {});

const cloneInitialColumns = () => initialColumns.map((column) => ({ ...column, taskIds: [...column.taskIds] }));

const createTasksFromPrompt = (prompt: string, startOrder: number): Task[] => {
  const normalized = prompt.replaceAll(" ", "").toLowerCase();
  const titles = normalized.includes("캡스톤") || normalized.includes("발표")
    ? ["발표 흐름 리허설", "AI 기능 시연 순서 정리", "질의응답 예상 질문 준비", "최종 데모 데이터 점검"]
    : [
        `${prompt || "프로젝트 목표"} 요구사항 정리`,
        "작업 단위 세분화",
        "담당자 및 우선순위 지정",
        "진행 상황 검증"
      ];

  return titles.map((title, index) => createPresentationTask(
    `presentation-ai-task-${Date.now()}-${index}`,
    title,
    "todo",
    startOrder + index,
    "AI Task Decomposition으로 생성된 발표용 mock 작업입니다.",
    index === 0 ? "높음" : "보통",
    0,
    "AI 작업 분해 완료"
  ));
};

const toneDot: Record<PresentationLog["tone"], string> = {
  primary: "bg-primary",
  tertiary: "bg-tertiary",
  success: "bg-emerald-300"
};

const columnTone: Record<KanbanColumnType["tone"], string> = {
  slate: "bg-outline",
  primary: "bg-primary",
  tertiary: "bg-tertiary"
};

const chatTone: Record<DemoChatMessage["tone"], string> = {
  team: "border-white/10 bg-black/25 text-on-surface-variant",
  mine: "border-primary/30 bg-primary/[0.12] text-on-surface",
  ai: "border-tertiary/30 bg-tertiary/[0.12] text-on-surface"
};

export function InteractivePresentation() {
  const [prompt, setPrompt] = useState("캡스톤 발표 준비 작업을 생성해줘");
  const [columns, setColumns] = useState<KanbanColumnType[]>(cloneInitialColumns);
  const [tasks, setTasks] = useState<Record<string, Task>>(createInitialTaskMap);
  const [newTaskTitle, setNewTaskTitle] = useState("배포 체크리스트 공유");
  const [dragTaskId, setDragTaskId] = useState<string | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("URL 확인 끝나면 공유드릴게요.");
  const [chatMessages, setChatMessages] = useState<DemoChatMessage[]>(initialChatMessages);
  const [memoInput, setMemoInput] = useState("발표 리허설 후 AI 보드 분석 문구를 더 짧게 정리하기");
  const [memos, setMemos] = useState<string[]>(initialMemos);
  const [logs, setLogs] = useState<PresentationLog[]>(baseLogs);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzingBoard, setIsAnalyzingBoard] = useState(false);
  const [isBoardAnalysisVisible, setIsBoardAnalysisVisible] = useState(true);
  const [isSummarizingMemos, setIsSummarizingMemos] = useState(false);
  const [isMemoSummaryVisible, setIsMemoSummaryVisible] = useState(false);

  const orderedColumns = useMemo(
    () => columns.map((column) => ({ ...column, taskIds: column.taskIds.filter((taskId) => tasks[taskId]) })),
    [columns, tasks]
  );

  const boardStats = useMemo(() => {
    const total = Object.keys(tasks).length;
    const done = columns.find((column) => column.id === "done")?.taskIds.length ?? 0;
    const doing = columns.find((column) => column.id === "doing")?.taskIds.length ?? 0;
    const todo = columns.find((column) => column.id === "todo")?.taskIds.length ?? 0;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;
    const bottleneck = todo >= doing && todo >= done ? "할 일 대기열" : doing >= done ? "진행 중 검증" : "완료 항목 리뷰";

    return { total, done, doing, todo, progress, bottleneck };
  }, [columns, tasks]);

  const memoSummary = useMemo(() => {
    const latestMemo = memos[memos.length - 1] ?? "추가 메모 없음";
    return [
      `현재 보드는 총 ${boardStats.total}개 카드 중 ${boardStats.done}개가 완료되었습니다.`,
      `주요 맥락은 “${latestMemo}”입니다.`,
      "발표에서는 칸반 이동, 채팅, 메모 요약, AI 보드 분석을 하나의 협업 흐름으로 연결하면 좋습니다."
    ];
  }, [boardStats.done, boardStats.total, memos]);

  const addLog = (label: string, detail: string, tone: PresentationLog["tone"] = "primary") => {
    setLogs((current) => [{ id: `${Date.now()}-${label}`, label, detail, tone }, ...current].slice(0, 9));
  };

  const resetPresentation = () => {
    setPrompt("캡스톤 발표 준비 작업을 생성해줘");
    setColumns(cloneInitialColumns());
    setTasks(createInitialTaskMap());
    setNewTaskTitle("배포 체크리스트 공유");
    setDragTaskId(null);
    setActiveColumnId(null);
    setChatInput("URL 확인 끝나면 공유드릴게요.");
    setChatMessages(initialChatMessages);
    setMemoInput("발표 리허설 후 AI 보드 분석 문구를 더 짧게 정리하기");
    setMemos(initialMemos);
    setLogs(baseLogs);
    setIsGenerating(false);
    setIsAnalyzingBoard(false);
    setIsBoardAnalysisVisible(true);
    setIsSummarizingMemos(false);
    setIsMemoSummaryVisible(false);
  };

  const addManualTask = (event: FormEvent) => {
    event.preventDefault();
    const title = newTaskTitle.trim();
    if (!title) return;

    const taskId = `presentation-manual-task-${Date.now()}`;
    const todoOrder = columns.find((column) => column.id === "todo")?.taskIds.length ?? 0;
    const task = createPresentationTask(taskId, title, "todo", todoOrder, "발표 중 직접 추가한 mock 카드입니다.", "보통", 0);

    setTasks((current) => ({ ...current, [taskId]: task }));
    setColumns((current) => current.map((column) => (column.id === "todo" ? { ...column, taskIds: [...column.taskIds, taskId] } : column)));
    setNewTaskTitle("");
    addLog("카드 생성", `‘${title}’ 카드가 할 일에 추가됨`, "success");
  };

  const generateAiTasks = () => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isGenerating) return;

    setIsGenerating(true);
    addLog("AI Task Decomposition 요청", `프롬프트: ${trimmedPrompt}`, "tertiary");

    window.setTimeout(() => {
      const todoOrder = columns.find((column) => column.id === "todo")?.taskIds.length ?? 0;
      const generated = createTasksFromPrompt(trimmedPrompt, todoOrder);
      const generatedMap = generated.reduce<Record<string, Task>>((acc, task) => ({ ...acc, [task.id]: task }), {});

      setTasks((current) => ({ ...current, ...generatedMap }));
      setColumns((current) => current.map((column) => (column.id === "todo" ? { ...column, taskIds: [...column.taskIds, ...generated.map((task) => task.id)] } : column)));
      setIsGenerating(false);
      addLog("AI Task 생성", `${generated.length}개 mock 카드가 할 일에 추가됨`, "success");
    }, 520);
  };

  const moveTask = (targetColumnId: string, beforeTaskId?: string) => {
    if (!dragTaskId) return;

    const draggedTask = tasks[dragTaskId];
    const targetColumn = columns.find((column) => column.id === targetColumnId);
    if (!draggedTask || !targetColumn) return;

    setColumns((current) => current.map((column) => {
      const filteredTaskIds = column.taskIds.filter((taskId) => taskId !== dragTaskId);
      if (column.id !== targetColumnId) return { ...column, taskIds: filteredTaskIds };

      const insertIndex = beforeTaskId ? Math.max(filteredTaskIds.indexOf(beforeTaskId), 0) : filteredTaskIds.length;
      const nextTaskIds = [...filteredTaskIds];
      nextTaskIds.splice(insertIndex, 0, dragTaskId);
      return { ...column, taskIds: nextTaskIds };
    }));

    setTasks((current) => ({
      ...current,
      [dragTaskId]: {
        ...current[dragTaskId],
        columnId: targetColumnId,
        progress: targetColumnId === "done" ? 100 : targetColumnId === "doing" ? 55 : 0
      }
    }));
    addLog("카드 이동", `‘${draggedTask.title}’ 카드가 ${targetColumn.title}으로 이동됨`, "success");
    setDragTaskId(null);
    setActiveColumnId(null);
  };

  const handleCardDrop = (event: DragEvent<HTMLDivElement>, columnId: string, beforeTaskId: string) => {
    event.preventDefault();
    event.stopPropagation();
    moveTask(columnId, beforeTaskId);
  };

  const sendChatMessage = (event: FormEvent) => {
    event.preventDefault();
    const message = chatInput.trim();
    if (!message) return;

    setChatMessages((current) => [...current, { id: `chat-${Date.now()}`, author: "나", text: message, tone: "mine" }]);
    setChatInput("");
    addLog("채팅 메시지 전송", message, "tertiary");
  };

  const addMemo = (event: FormEvent) => {
    event.preventDefault();
    const memo = memoInput.trim();
    if (!memo) return;

    setMemos((current) => [...current, memo]);
    setMemoInput("");
    setIsMemoSummaryVisible(false);
    addLog("프로젝트 메모 추가", memo, "primary");
  };

  const analyzeBoard = () => {
    if (isAnalyzingBoard) return;
    setIsAnalyzingBoard(true);
    addLog("AI 보드 분석 요청", `${boardStats.total}개 카드 상태 분석`, "tertiary");

    window.setTimeout(() => {
      setIsBoardAnalysisVisible(true);
      setIsAnalyzingBoard(false);
      addLog("AI 보드 분석 완료", `진행률 ${boardStats.progress}%, 병목: ${boardStats.bottleneck}`, "success");
    }, 480);
  };

  const summarizeMemos = () => {
    if (isSummarizingMemos) return;
    setIsSummarizingMemos(true);
    addLog("AI 메모 요약 요청", `${memos.length}개 프로젝트 메모 분석`, "tertiary");

    window.setTimeout(() => {
      setIsMemoSummaryVisible(true);
      setIsSummarizingMemos(false);
      addLog("AI 메모 요약 완료", "회의록, 진행 이슈, 다음 작업 방향 표시", "success");
    }, 480);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#07080d] text-on-surface selection:bg-primary/30">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/2 top-[-20rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[130px]" />
        <div className="absolute bottom-[18%] right-[-10rem] h-[28rem] w-[28rem] rounded-full bg-tertiary/15 blur-[110px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
      </div>

      <section className="relative z-10 flex min-h-[88vh] items-center px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.85fr]">
          <Reveal>
            <p className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-tertiary backdrop-blur">캡스톤 디자인 발표</p>
            <h1 className="max-w-4xl text-6xl font-black tracking-[-0.08em] text-white sm:text-7xl lg:text-8xl">Kanban AI</h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-on-surface-variant sm:text-2xl">AI 기반 실시간 협업 칸반 프로젝트 관리 시스템</p>
            <div className="mt-8 grid max-w-2xl gap-3 text-sm text-on-surface-variant sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur"><span className="text-outline">시연 범위</span><strong className="mt-1 block text-white">보드 · 채팅 · 메모 · AI</strong></div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur"><span className="text-outline">발표 방식</span><strong className="mt-1 block text-white">mock state 기반 안전 시연</strong></div>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#kanban-demo" className="rounded-full bg-primary px-6 py-3 text-sm font-black text-black transition hover:scale-105 hover:brightness-110">칸반 시연 바로가기</a>
              <span className="inline-flex items-center gap-2 text-sm text-outline"><ArrowDown className="h-4 w-4 animate-bounce" /> 스크롤로 전체 기능 확인</span>
            </div>
          </Reveal>

          <Reveal className="lg:translate-y-6">
            <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur-2xl">
              <div className="absolute -right-6 -top-6 rounded-3xl border border-tertiary/30 bg-tertiary/10 px-5 py-4 text-sm font-bold text-tertiary shadow-xl backdrop-blur">발표 전용 안전 모드</div>
              <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-4">
                <div className="mb-4 flex items-center justify-between"><span className="text-sm font-bold text-white">Kanban AI Live Flow</span><span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-200">Interactive Mock</span></div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {initialColumns.map((column, index) => (
                    <div key={column.id} className="min-h-56 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                      <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-white"><span className={`h-2 w-2 rounded-full ${columnTone[column.tone]}`} />{column.title}</div>
                      <div className="space-y-3">
                        {[0, 1].map((item) => <div key={item} className="h-14 rounded-xl border border-white/10 bg-white/[0.06]" style={{ opacity: 1 - index * 0.15 - item * 0.12 }} />)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative z-10 px-6 py-20 sm:px-10 lg:px-16">
        <Reveal className="mx-auto max-w-6xl">
          <SectionLabel label="Problem" />
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <h2 className="text-4xl font-black tracking-[-0.05em] text-white sm:text-6xl">작업, 대화, 회의 맥락이 흩어지면 프로젝트 진행 판단이 느려집니다.</h2>
            <div className="grid gap-4">
              {["작업 분해와 우선순위 정리가 반복적으로 수동 처리됩니다.", "보드 변경과 팀 대화가 분리되면 현재 상황을 다시 설명해야 합니다.", "회의 내용과 이슈가 누적되어도 핵심 맥락을 빠르게 파악하기 어렵습니다."].map((text, index) => (
                <div key={text} className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 text-on-surface-variant backdrop-blur">
                  <span className="mr-3 text-lg font-black text-primary">0{index + 1}</span>{text}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="relative z-10 px-6 py-20 sm:px-10 lg:px-16">
        <Reveal className="mx-auto max-w-7xl">
          <SectionLabel label="Core Features" />
          <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <h2 className="max-w-3xl text-4xl font-black tracking-[-0.05em] text-white sm:text-6xl">핵심 기능은 실제 mock 인터랙션으로 모두 시연합니다.</h2>
            <p className="max-w-md text-sm leading-6 text-outline">카드 생성, 드래그 앤 드롭, 팀 채팅, 메모, AI 기능, 이벤트 로그까지 발표 페이지 안에서 확인합니다.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="group rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/[0.07]">
                <div className="mb-6 inline-flex rounded-2xl bg-primary/15 p-3 text-primary transition group-hover:scale-110">{feature.icon}</div>
                <h3 className="text-xl font-black text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-on-surface-variant">{feature.description}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      <section id="kanban-demo" className="relative z-10 px-4 py-20 sm:px-8 lg:px-12">
        <Reveal className="mx-auto max-w-[1500px]">
          <div className="rounded-[2rem] border border-white/10 bg-[#0b0d14]/90 p-4 shadow-2xl backdrop-blur-2xl lg:p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <SectionLabel label="칸반 보드 시연" />
                <h2 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-5xl">카드 생성 → 드래그 이동 → 이벤트 로그까지 보여줍니다.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-outline">실제 API 호출 없이 mock state로 카드 생성과 컬럼 이동을 시연합니다.</p>
              </div>
              <button onClick={resetPresentation} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-on-surface-variant transition hover:border-error/40 hover:text-error">
                <RefreshCcw className="h-4 w-4" /> 시연 초기화
              </button>
            </div>

            <div className="mb-5 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
              <form onSubmit={addManualTask} className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur">
                <div className="mb-4 flex items-center gap-2 text-sm font-bold text-primary"><Plus className="h-4 w-4" /> 직접 카드 생성</div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input value={newTaskTitle} onChange={(event) => setNewTaskTitle(event.target.value)} placeholder="새 카드 제목" className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15" />
                  <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-black text-black transition hover:brightness-110">
                    카드 추가 <Plus className="h-4 w-4" />
                  </button>
                </div>
              </form>

              <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur">
                <div className="mb-4 flex items-center gap-2 text-sm font-bold text-primary"><Sparkles className="h-4 w-4" /> AI Task Decomposition</div>
                <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
                  <input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="AI에게 작업 분해 요청" className="min-w-0 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15" />
                  <button type="button" onClick={generateAiTasks} disabled={isGenerating || !prompt.trim()} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-black text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">
                    {isGenerating ? "AI 생성 중..." : "AI Task 생성"}<Sparkles className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              {orderedColumns.map((column) => (
                <section
                  key={column.id}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setActiveColumnId(column.id);
                  }}
                  onDragLeave={() => setActiveColumnId(null)}
                  onDrop={(event) => {
                    event.preventDefault();
                    moveTask(column.id);
                  }}
                  className={`min-h-[520px] rounded-3xl border p-4 transition ${activeColumnId === column.id ? "border-primary/50 bg-primary/10" : "border-white/10 bg-white/[0.04]"}`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${columnTone[column.tone]}`} /><h3 className="text-base font-black text-white">{column.title}</h3></div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-outline">{column.taskIds.length} cards</span>
                  </div>
                  <div className="space-y-3">
                    {column.taskIds.length === 0 ? <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-white/10 text-xs text-outline">카드를 여기에 드롭하세요</div> : null}
                    {column.taskIds.map((taskId) => {
                      const task = tasks[taskId];
                      if (!task) return null;

                      return (
                        <div
                          key={taskId}
                          draggable
                          onDragStart={() => setDragTaskId(taskId)}
                          onDragEnd={() => {
                            setDragTaskId(null);
                            setActiveColumnId(null);
                          }}
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={(event) => handleCardDrop(event, column.id, taskId)}
                          className={`cursor-grab rounded-2xl border border-white/10 bg-black/30 p-4 shadow-xl transition active:cursor-grabbing ${dragTaskId === taskId ? "scale-[0.98] border-primary/50 opacity-60" : "hover:-translate-y-1 hover:border-primary/30"}`}
                        >
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-black text-white">{task.title}</p>
                              <p className="mt-2 line-clamp-2 text-xs leading-5 text-on-surface-variant">{task.description}</p>
                            </div>
                            <GripVertical className="mt-1 h-4 w-4 shrink-0 text-outline" />
                          </div>
                          <div className="mb-3 flex flex-wrap gap-2">
                            <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-bold text-primary">{task.priority}</span>
                            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] text-outline">{task.aiStatus}</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-primary" style={{ width: `${task.progress}%` }} /></div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="relative z-10 px-6 py-20 sm:px-10 lg:px-16">
        <Reveal className="mx-auto max-w-7xl">
          <SectionLabel label="팀 채팅 & 실시간 로그" />
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black tracking-[-0.04em] text-white">팀 채팅 시연</h2>
                  <p className="mt-2 text-sm text-outline">메시지 전송도 mock state로 처리하고 이벤트 로그에 기록합니다.</p>
                </div>
                <span className="rounded-full bg-tertiary/15 px-3 py-1 text-xs font-bold text-tertiary">Mock Chat</span>
              </div>
              <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                {chatMessages.map((message) => (
                  <div key={message.id} className={`rounded-2xl border p-4 ${chatTone[message.tone]}`}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-xs font-black text-white">{message.author}</span>
                      <span className="text-[10px] text-outline">LIVE</span>
                    </div>
                    <p className="text-sm leading-6">{message.text}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={sendChatMessage} className="mt-5 flex gap-3">
                <input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="메시지 입력" className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary/50" />
                <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-black text-black transition hover:brightness-110">
                  전송 <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
            <EventLog logs={logs} large />
          </div>
        </Reveal>
      </section>

      <section className="relative z-10 px-6 py-20 sm:px-10 lg:px-16">
        <Reveal className="mx-auto max-w-7xl">
          <SectionLabel label="프로젝트 메모" />
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <h2 className="text-4xl font-black tracking-[-0.05em] text-white sm:text-6xl">칸반 카드로 담기 어려운 맥락은 메모로 남깁니다.</h2>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-outline">회의 내용, 이슈, 작업 아이디어를 프로젝트별 메모로 쌓고 AI 요약의 입력으로 활용합니다.</p>
              <form onSubmit={addMemo} className="mt-8 rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-tertiary">새 메모</label>
                <textarea value={memoInput} onChange={(event) => setMemoInput(event.target.value)} rows={4} placeholder="회의 내용, 이슈, 아이디어를 입력하세요" className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary/50" />
                <button type="submit" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-black text-black transition hover:brightness-110">
                  메모 추가 <Plus className="h-4 w-4" />
                </button>
              </form>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#0b0d14]/90 p-5 shadow-2xl backdrop-blur-2xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-black text-white">프로젝트 메모 목록</h3>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-outline">{memos.length}개 기록</span>
              </div>
              <div className="space-y-3">
                {memos.map((memo, index) => (
                  <div key={`${memo}-${index}`} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-bold text-tertiary"><span className="rounded-full bg-tertiary/15 px-2 py-0.5">MEMO {index + 1}</span> 프로젝트 기록</div>
                    <p className="text-sm leading-6 text-on-surface-variant">{memo}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="relative z-10 px-4 py-20 sm:px-8 lg:px-12">
        <Reveal className="mx-auto max-w-[1500px]">
          <div className="rounded-[2rem] border border-white/10 bg-[#0b0d14]/90 p-4 shadow-2xl backdrop-blur-2xl lg:p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <SectionLabel label="AI 기능 통합 시연" />
                <h2 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-5xl">Task 생성, Board 분석, Memo 요약을 현재 mock 상태와 연결합니다.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-outline">발표자는 버튼만 눌러 AI가 프로젝트 흐름을 보조하는 장면을 설명할 수 있습니다.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={generateAiTasks} disabled={isGenerating || !prompt.trim()} className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-black text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">
                  AI Task 생성 <Sparkles className="h-4 w-4" />
                </button>
                <button type="button" onClick={analyzeBoard} disabled={isAnalyzingBoard} className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-3 text-sm font-bold text-primary transition hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50">
                  {isAnalyzingBoard ? "분석 중..." : "AI 보드 분석"}<Bot className="h-4 w-4" />
                </button>
                <button type="button" onClick={summarizeMemos} disabled={isSummarizingMemos} className="inline-flex items-center justify-center gap-2 rounded-full border border-tertiary/30 bg-tertiary/10 px-5 py-3 text-sm font-bold text-tertiary transition hover:bg-tertiary/20 disabled:cursor-not-allowed disabled:opacity-50">
                  {isSummarizingMemos ? "요약 중..." : "AI 메모 요약"}<MessageSquareText className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-black text-primary"><Sparkles className="h-4 w-4" /> AI Task Decomposition</h3>
                <p className="text-sm leading-6 text-on-surface-variant">입력한 프롬프트를 여러 개의 실행 가능한 Task로 분해하고 할 일 컬럼에 추가합니다.</p>
                <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4 text-xs leading-5 text-outline">현재 프롬프트: {prompt}</div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(195,192,255,0.16),rgba(255,255,255,0.045)_46%,rgba(0,0,0,0.18))] p-5">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-black text-primary"><Bot className="h-4 w-4" /> AI Board Analysis</h3>
                {isBoardAnalysisVisible ? (
                  <div className="space-y-3">
                    <InsightCard label="진행률" value={`${boardStats.progress}%`} note={`${boardStats.done}/${boardStats.total}개 카드 완료`} />
                    <InsightCard label="병목" value={boardStats.bottleneck} note={`할 일 ${boardStats.todo}개 · 진행 중 ${boardStats.doing}개`} />
                    <InsightCard label="추천 액션" value="메모 요약 공유" note="팀 합류자가 빠르게 맥락을 이해하도록 요약을 먼저 보여주세요." />
                  </div>
                ) : <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-outline">AI 보드 분석 버튼을 누르면 결과가 표시됩니다.</div>}
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-black text-primary"><MessageSquareText className="h-4 w-4" /> AI Memo Summary</h3>
                {isMemoSummaryVisible ? (
                  <div className="space-y-3">
                    {memoSummary.map((line) => <p key={line} className="rounded-2xl border border-primary/30 bg-primary/[0.08] p-4 text-sm leading-6 text-on-surface">{line}</p>)}
                  </div>
                ) : <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm leading-6 text-outline">AI 메모 요약 버튼을 누르면 현재 메모 목록 기반 요약이 표시됩니다.</div>}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="relative z-10 px-6 py-20 sm:px-10 lg:px-16">
        <Reveal className="mx-auto max-w-7xl">
          <SectionLabel label="아키텍처 & 기술 스택" />
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <h2 className="max-w-4xl text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">서비스 흐름은 단순하게, 기술 연결은 한 장으로 설명합니다.</h2>
              <div className="mt-8 grid gap-3 md:grid-cols-5">
                {architectureNodes.map((node, index) => (
                  <div key={node.label} className="relative rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur">
                    <div className="mb-4 inline-flex rounded-xl bg-tertiary/15 p-2 text-tertiary">{node.icon}</div>
                    <h3 className="text-base font-black text-white">{node.label}</h3>
                    <p className="mt-1 text-xs text-outline">{node.detail}</p>
                    {index < architectureNodes.length - 1 ? <ChevronRight className="absolute -right-4 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-primary md:block" /> : null}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3">
              {techStacks.map((stack) => (
                <article key={stack.group} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur">
                  <h3 className="mb-3 text-base font-black text-white">{stack.group}</h3>
                  <div className="flex flex-wrap gap-2">
                    {stack.items.map((item) => <span key={item} className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-on-surface-variant">{item}</span>)}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="relative z-10 px-6 py-24 sm:px-10 lg:px-16">
        <Reveal className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(195,192,255,0.22),rgba(255,255,255,0.045)_42%,rgba(255,255,255,0.03))] p-8 shadow-2xl backdrop-blur lg:p-10">
          <SectionLabel label="프로젝트 결과" />
          <h2 className="max-w-4xl text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">MVP 구현 결과와 다음 개선 방향을 정리합니다.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <StatsCard title="프로젝트 성과" value="AI 협업 칸반 MVP" note="프로젝트 관리, 칸반, AI 기능, 채팅, 실시간 협업을 하나로 구현했습니다." />
            <StatsCard title="배운 점" value="REST + WebSocket 구조" note="Next.js, Express, MongoDB, Socket.io 기반 협업 흐름을 검증했습니다." />
            <StatsCard title="향후 개선" value="AI 추천 고도화" note="요약 정확도, 권한 관리, 알림 자동화, 배포 안정화를 개선합니다." />
          </div>
          <div className="mt-8 flex flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-black/20 p-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 inline-flex rounded-2xl bg-primary/15 p-2 text-primary"><GitBranch className="h-5 w-5" /></div>
              <p className="text-sm text-on-surface-variant">발표가 끝나면 실제 서비스 데이터는 대시보드에서 확인합니다.</p>
            </div>
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-black transition hover:scale-105">
              실제 서비스 보기 <CheckCircle2 className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

function SectionLabel({ label }: { label: string }) {
  return <p className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-tertiary">{label}</p>;
}

function InsightCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-outline">{label}</span>
        <strong className="text-lg text-white">{value}</strong>
      </div>
      <p className="mt-2 text-xs leading-5 text-on-surface-variant">{note}</p>
    </div>
  );
}

function EventLog({ logs, large = false }: { logs: PresentationLog[]; large?: boolean }) {
  return (
    <div className={`rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur ${large ? "p-7" : ""}`}>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-black text-white">이벤트 로그</h3>
        <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-200">실시간 협업 흐름</span>
      </div>
      <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
        {logs.length === 0 ? <div className="rounded-2xl border border-dashed border-white/10 p-4 text-xs text-outline">이벤트 로그가 초기화되었습니다.</div> : null}
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
            <span className={`mt-1 h-2.5 w-2.5 rounded-full ${toneDot[log.tone]}`} />
            <div>
              <p className="text-sm font-bold text-white">{log.label}</p>
              <p className="mt-1 text-xs leading-5 text-on-surface-variant">{log.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
