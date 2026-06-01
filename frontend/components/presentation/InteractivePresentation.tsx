"use client";

import Link from "next/link";
import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  Bell,
  Bot,
  Braces,
  CheckCircle2,
  ChevronRight,
  Database,
  GitBranch,
  GripVertical,
  Layers3,
  MessageSquareText,
  Network,
  Plus,
  RefreshCcw,
  Send,
  Sparkles,
  Users,
  Workflow,
  Zap
} from "lucide-react";
import { ChatMessage } from "@/components/kanban/ChatMessage";
import { TaskCard } from "@/components/kanban/TaskCard";
import { TaskForm } from "@/components/kanban/TaskForm";
import { TaskModal } from "@/components/kanban/TaskModal";
import { KanbanColumnType, Task, TaskInput } from "@/components/kanban/types";
import { StatsCard } from "@/components/dashboard/StatsCard";

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

const initialColumns: KanbanColumnType[] = [
  { id: "todo", title: "할 일", tone: "slate", taskIds: [] },
  { id: "doing", title: "진행 중", tone: "primary", taskIds: [] },
  { id: "done", title: "완료", tone: "tertiary", taskIds: [] }
];

const baseLogs: PresentationLog[] = [
  { id: "log-ready", label: "발표 모드 준비 완료", detail: "발표 전용 안전 모드로 실행 중", tone: "primary" },
  { id: "log-socket", label: "발표자 세션 연결", detail: "발표자 세션이 보드에 연결됨", tone: "tertiary" }
];

const features: FeatureCard[] = [
  { title: "AI Task 생성", description: "프롬프트를 기반으로 프로젝트 작업을 세분화하는 흐름을 시연합니다.", icon: <Bot className="h-5 w-5" /> },
  { title: "실시간 협업", description: "카드 이동과 채팅 이벤트가 즉시 동기화되는 경험을 표현합니다.", icon: <Zap className="h-5 w-5" /> },
  { title: "칸반 보드", description: "할 일, 진행 중, 완료 흐름에서 작업 상태를 관리합니다.", icon: <Layers3 className="h-5 w-5" /> },
  { title: "팀 채팅", description: "프로젝트 맥락을 유지하면서 팀 커뮤니케이션을 이어갑니다.", icon: <MessageSquareText className="h-5 w-5" /> },
  { title: "프로젝트 초대", description: "팀원을 프로젝트에 초대하고 협업 범위를 확장합니다.", icon: <Users className="h-5 w-5" /> },
  { title: "알림 시스템", description: "중요 변경 사항과 협업 이벤트를 놓치지 않도록 안내합니다.", icon: <Bell className="h-5 w-5" /> }
];

const techStacks = [
  { group: "Frontend", items: ["Next.js App Router", "React", "TypeScript", "Tailwind CSS"] },
  { group: "Backend", items: ["Node.js", "Express"] },
  { group: "Database", items: ["MongoDB"] },
  { group: "Realtime", items: ["Socket.io"] },
  { group: "AI", items: ["OpenAI API"] }
];

const architectureNodes = [
  { label: "Frontend", detail: "Next.js / React", icon: <Workflow className="h-5 w-5" /> },
  { label: "Backend", detail: "Node.js / Express", icon: <Braces className="h-5 w-5" /> },
  { label: "MongoDB", detail: "Project · Task · Chat", icon: <Database className="h-5 w-5" /> },
  { label: "Socket.io", detail: "Realtime Sync", icon: <Network className="h-5 w-5" /> },
  { label: "OpenAI API", detail: "Task Decomposition", icon: <Sparkles className="h-5 w-5" /> }
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
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
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

const createPresentationTask = (id: string, title: string, order: number, description = "AI 작업 분해 결과로 생성된 시연용 작업입니다."): Task => ({
  id,
  columnId: "todo",
  order,
  title,
  description,
  assignee: "발표자",
  assigneeInitial: "PR",
  progress: 0,
  dueDate: "발표 일정",
  aiStatus: "AI 작업 분해 완료",
  priority: order === 0 ? "높음" : "보통"
});

const createTasksFromPrompt = (prompt: string): Task[] => {
  const normalized = prompt.replaceAll(" ", "").toLowerCase();
  const titles = normalized.includes("캡스톤") || normalized.includes("발표")
    ? ["발표 자료 흐름 정리", "핵심 기능 시연 순서 구성", "AI Task 생성 시연 준비", "실시간 협업 기능 설명", "최종 발표 리허설"]
    : [
        `${prompt || "프로젝트 목표"} 요구사항 정리`,
        "작업 단위 세분화",
        "담당자 및 우선순위 지정",
        "진행 상황 검증"
      ];

  return titles.map((title, index) => createPresentationTask(`presentation-task-${Date.now()}-${index}`, title, index));
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

export function InteractivePresentation() {
  const [prompt, setPrompt] = useState("캡스톤 발표 준비 작업을 생성해줘");
  const [columns, setColumns] = useState<KanbanColumnType[]>(initialColumns);
  const [tasks, setTasks] = useState<Record<string, Task>>({});
  const [dragTaskId, setDragTaskId] = useState<string | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [addingColumnId, setAddingColumnId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [logs, setLogs] = useState<PresentationLog[]>(baseLogs);
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatInput, setChatInput] = useState("시연 보드 동기화 확인");
  const [chatMessages, setChatMessages] = useState([
    { id: "chat-1", sender: "AI", time: "LIVE", message: "프롬프트를 입력하면 할 일 열에 작업이 생성됩니다.", type: "ai" as const },
    { id: "chat-2", sender: "발표자", time: "LIVE", message: "카드는 드래그 앤 드롭으로 이동할 수 있습니다.", type: "mine" as const }
  ]);

  const orderedColumns = useMemo(
    () => columns.map((column) => ({ ...column, taskIds: column.taskIds.filter((taskId) => tasks[taskId]) })),
    [columns, tasks]
  );

  const addLog = (label: string, detail: string, tone: PresentationLog["tone"] = "primary") => {
    setLogs((current) => [{ id: `${Date.now()}-${label}`, label, detail, tone }, ...current].slice(0, 7));
  };

  const resetPresentation = () => {
    setPrompt("");
    setColumns(initialColumns);
    setTasks({});
    setLogs([]);
    setChatInput("");
    setChatMessages([]);
    setDragTaskId(null);
    setActiveColumnId(null);
    setAddingColumnId(null);
    setSelectedTaskId(null);
  };

  const createManualTask = (columnId: string, payload: TaskInput) => {
    const taskId = `presentation-manual-task-${Date.now()}`;
    const targetColumn = columns.find((column) => column.id === columnId);
    const task = createPresentationTask(taskId, payload.title, targetColumn?.taskIds.length ?? 0, payload.description || "발표자가 직접 생성한 시연용 작업입니다.");
    const nextTask: Task = {
      ...task,
      columnId,
      priority: payload.priority,
      assignee: payload.assignee || "발표자",
      assigneeInitial: (payload.assignee || "발표자").slice(0, 2),
      dueDate: payload.dueDate || "발표 일정",
      aiStatus: "수동 생성 작업"
    };

    setTasks((current) => ({ ...current, [taskId]: nextTask }));
    setColumns((current) => current.map((column) => (column.id === columnId ? { ...column, taskIds: [...column.taskIds, taskId] } : column)));
    setAddingColumnId(null);
    addLog("작업 생성 완료", `${payload.title} → ${targetColumn?.title ?? "보드"}`, "success");
  };

  const updatePresentationTask = (taskId: string, partial: Partial<Task>) => {
    const task = tasks[taskId];
    if (!task) return;

    setTasks((current) => ({
      ...current,
      [taskId]: {
        ...current[taskId],
        ...partial,
        assigneeInitial: partial.assignee ? partial.assignee.slice(0, 2) : current[taskId].assigneeInitial
      }
    }));
    setSelectedTaskId(null);
    addLog("작업 수정 완료", partial.title || task.title, "primary");
  };

  const deletePresentationTask = (taskId: string) => {
    const task = tasks[taskId];
    if (!task) return;

    setTasks((current) => {
      const next = { ...current };
      delete next[taskId];
      return next;
    });
    setColumns((current) => current.map((column) => ({ ...column, taskIds: column.taskIds.filter((id) => id !== taskId) })));
    if (selectedTaskId === taskId) setSelectedTaskId(null);
    addLog("작업 삭제 완료", task.title, "tertiary");
  };

  const generateTasks = (event: FormEvent) => {
    event.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isGenerating) return;

    setIsGenerating(true);
    addLog("AI 작업 생성 요청", `프롬프트: ${trimmedPrompt}`, "tertiary");

    window.setTimeout(() => {
      const generated = createTasksFromPrompt(trimmedPrompt);
      const nextTasks = generated.reduce<Record<string, Task>>((acc, task) => ({ ...acc, [task.id]: task }), {});
      setTasks(nextTasks);
      setColumns(initialColumns.map((column) => (column.id === "todo" ? { ...column, taskIds: generated.map((task) => task.id) } : column)));
      addLog("AI 작업 생성 완료", `${generated.length}개 작업이 할 일 열에 생성됨`, "success");
      addLog("보드 동기화 완료", "발표용 보드 상태 업데이트 완료", "primary");
      setChatMessages((current) => [
        ...current,
        { id: `${Date.now()}-chat-ai`, sender: "AI", time: "NOW", message: `${generated.length}개의 작업을 할 일 열에 생성했습니다.`, type: "ai" as const }
      ]);
      setIsGenerating(false);
    }, 650);
  };

  const moveTask = (targetColumnId: string) => {
    if (!dragTaskId) return;

    const targetIndex = columns.find((column) => column.id === targetColumnId)?.taskIds.filter((taskId) => taskId !== dragTaskId).length ?? 0;
    setColumns((current) =>
      current.map((column) => {
        const withoutTask = column.taskIds.filter((taskId) => taskId !== dragTaskId);
        if (column.id !== targetColumnId) return { ...column, taskIds: withoutTask };
        return { ...column, taskIds: [...withoutTask, dragTaskId] };
      })
    );
    setTasks((current) => ({ ...current, [dragTaskId]: { ...current[dragTaskId], columnId: targetColumnId, order: targetIndex, progress: targetColumnId === "done" ? 100 : targetColumnId === "doing" ? 45 : 0 } }));
    addLog("작업 이동 완료", `${tasks[dragTaskId]?.title ?? "작업"} → ${columns.find((column) => column.id === targetColumnId)?.title}`, "success");
    addLog("보드 동기화 완료", "Socket.io 이벤트 흐름을 실시간 로그로 시각화", "primary");
    setDragTaskId(null);
    setActiveColumnId(null);
  };

  const submitChat = (event: FormEvent) => {
    event.preventDefault();
    const message = chatInput.trim();
    if (!message) return;
    setChatMessages((current) => [...current, { id: `${Date.now()}-chat`, sender: "발표자", time: "NOW", message, type: "mine" as const }]);
    setChatInput("");
    addLog("채팅 메시지 수신", message, "tertiary");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#07080d] text-on-surface selection:bg-primary/30">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/2 top-[-20rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[130px]" />
        <div className="absolute bottom-[18%] right-[-10rem] h-[28rem] w-[28rem] rounded-full bg-tertiary/15 blur-[110px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
      </div>

      <section className="relative z-10 flex min-h-screen items-center px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
          <Reveal>
            <p className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-tertiary backdrop-blur">캡스톤 디자인 발표</p>
            <h1 className="max-w-4xl text-6xl font-black tracking-[-0.08em] text-white sm:text-7xl lg:text-8xl">Kanban AI</h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-on-surface-variant sm:text-2xl">AI 기반 실시간 협업 칸반 프로젝트 관리 시스템</p>
            <div className="mt-8 grid max-w-2xl gap-3 text-sm text-on-surface-variant sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur"><span className="text-outline">팀 정보</span><strong className="mt-1 block text-white">Kanban AI 개발팀</strong></div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur"><span className="text-outline">발표자</span><strong className="mt-1 block text-white">김관호 · 시스템 설계 및 구현</strong></div>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#ai-presentation" className="rounded-full bg-primary px-6 py-3 text-sm font-black text-black transition hover:scale-105 hover:brightness-110">AI 시연 바로가기</a>
              <span className="inline-flex items-center gap-2 text-sm text-outline"><ArrowDown className="h-4 w-4 animate-bounce" /> 스크롤로 발표 진행</span>
            </div>
          </Reveal>

          <Reveal className="lg:translate-y-10">
            <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur-2xl">
              <div className="absolute -right-8 -top-8 rounded-3xl border border-tertiary/30 bg-tertiary/10 px-5 py-4 text-sm font-bold text-tertiary shadow-xl backdrop-blur">실시간 시연 준비 완료</div>
              <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-4">
                <div className="mb-4 flex items-center justify-between"><span className="text-sm font-bold text-white">Kanban AI 보드</span><span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-200">발표 전용 안전 모드</span></div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {initialColumns.map((column, index) => (
                    <div key={column.id} className="min-h-60 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                      <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-white"><span className={`h-2 w-2 rounded-full ${columnTone[column.tone]}`} />{column.title}</div>
                      <div className="space-y-3">
                        {[0, 1].map((item) => <div key={item} className="h-16 rounded-xl border border-white/10 bg-white/[0.06]" style={{ opacity: 1 - index * 0.15 - item * 0.12 }} />)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative z-10 px-6 py-24 sm:px-10 lg:px-16">
        <Reveal className="mx-auto max-w-6xl">
          <SectionLabel label="Problem" />
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <h2 className="text-4xl font-black tracking-[-0.05em] text-white sm:text-6xl">프로젝트 관리의 복잡함을 협업 흐름 안에서 해결합니다.</h2>
            <div className="grid gap-4">
              {["기존 프로젝트 관리에서 작업 분해와 우선순위 정리가 수동으로 반복됩니다.", "협업 중 변경 사항이 늦게 공유되면 보드와 채팅의 맥락이 쉽게 분리됩니다.", "AI를 활용해 초기 작업 설계 시간을 줄이고 팀이 실행에 집중하도록 돕습니다."].map((text, index) => (
                <div key={text} className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 text-on-surface-variant backdrop-blur">
                  <span className="mr-3 text-lg font-black text-primary">0{index + 1}</span>{text}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="relative z-10 px-6 py-24 sm:px-10 lg:px-16">
        <Reveal className="mx-auto max-w-7xl">
          <SectionLabel label="Core Features" />
          <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <h2 className="max-w-3xl text-4xl font-black tracking-[-0.05em] text-white sm:text-6xl">핵심 기능은 카드처럼 빠르게 이해되고, 시연으로 바로 검증됩니다.</h2>
            <p className="max-w-md text-sm leading-6 text-outline">실제 서비스에서 제공하는 기능 흐름을 발표 전용 안전 상태와 기존 UI 컴포넌트로 재구성했습니다.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="group rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/[0.07]">
                <div className="mb-8 inline-flex rounded-2xl bg-primary/15 p-3 text-primary transition group-hover:scale-110">{feature.icon}</div>
                <h3 className="text-xl font-black text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-on-surface-variant">{feature.description}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      <section id="ai-presentation" className="relative z-10 px-4 py-24 sm:px-8 lg:px-12">
        <Reveal className="mx-auto max-w-[1500px]">
          <div className="sticky top-4 rounded-[2rem] border border-white/10 bg-[#0b0d14]/90 p-4 shadow-2xl backdrop-blur-2xl lg:p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <SectionLabel label="AI 시연" />
                <h2 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-5xl">프롬프트 입력 → AI Task 생성 → 보드에서 직접 이동</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-outline">발표 중 서비스 데이터에 영향을 주지 않는 안전한 시연 환경입니다. 생성된 Task는 드래그 앤 드롭으로 이동할 수 있습니다.</p>
              </div>
              <button onClick={resetPresentation} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-on-surface-variant transition hover:border-error/40 hover:text-error">
                <RefreshCcw className="h-4 w-4" /> 시연 초기화
              </button>
            </div>

            <div className="grid gap-5 xl:grid-cols-[360px_1fr_330px]">
              <form onSubmit={generateTasks} className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur">
                <div className="mb-4 flex items-center gap-2 text-sm font-bold text-primary"><Sparkles className="h-4 w-4" /> AI 작업 생성</div>
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-outline">프롬프트</label>
                <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={7} placeholder="예: 캡스톤 발표 준비 작업을 생성해줘" className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15" />
                <button type="submit" disabled={isGenerating || !prompt.trim()} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-black text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">
                  {isGenerating ? "AI 분석 중..." : "AI 생성 버튼"}<Sparkles className="h-4 w-4" />
                </button>
                <p className="mt-4 text-xs leading-5 text-outline">예시: “캡스톤 발표 준비” 입력 시 할 일 열에 실행 가능한 Task가 생성됩니다.</p>
              </form>

              <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/25">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <div className="flex items-center gap-2 text-sm font-black text-white"><GripVertical className="h-4 w-4 text-outline" /> 인터랙티브 칸반 보드</div>
                  <div className="flex flex-wrap items-center justify-end gap-2"><span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">카드 생성 · 수정 · 삭제</span><span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">드래그 앤 드롭</span></div>
                </div>
                <div className="flex min-h-[620px] items-start gap-4 overflow-x-auto p-4">
                  {orderedColumns.map((column) => (
                    <section
                      key={column.id}
                      onDragOver={(event) => {
                        event.preventDefault();
                        setActiveColumnId(column.id);
                      }}
                      onDragLeave={() => setActiveColumnId(null)}
                      onDrop={() => moveTask(column.id)}
                      className={`min-h-[620px] w-[300px] min-w-[300px] rounded-2xl border p-3 transition ${activeColumnId === column.id ? "border-primary/50 bg-primary/10" : "border-white/10 bg-white/[0.04]"}`}
                    >
                      <div className="mb-3 flex items-center justify-between px-1">
                        <div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${columnTone[column.tone]}`} /><h3 className="text-sm font-semibold text-on-surface">{column.title}</h3><span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] text-on-surface-variant">{column.taskIds.length}</span></div>
                        <button
                          type="button"
                          onClick={() => setAddingColumnId((current) => (current === column.id ? null : column.id))}
                          className="rounded-md p-1 text-outline transition hover:bg-white/10 hover:text-on-surface"
                          aria-label={`${column.title} 작업 추가`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        {addingColumnId === column.id ? (
                          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                            <TaskForm onCancel={() => setAddingColumnId(null)} onSubmit={(payload) => createManualTask(column.id, payload)} />
                          </div>
                        ) : null}
                        {column.taskIds.length === 0 ? <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-white/10 text-xs text-outline">여기에 작업을 놓으세요</div> : null}
                        {column.taskIds.map((taskId) => (
                          <div key={taskId} draggable onDragStart={() => setDragTaskId(taskId)} onDragEnd={() => setDragTaskId(null)} className="cursor-grab active:cursor-grabbing">
                            <TaskCard task={tasks[taskId]} isDragging={dragTaskId === taskId} onClick={() => { setSelectedTaskId(taskId); addLog("작업 카드 열림", tasks[taskId].title, "primary"); }} onDelete={() => deletePresentationTask(taskId)} />
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>

              <aside className="grid gap-5">
                <EventLog logs={logs} />
                <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur">
                  <div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-black text-white">팀 채팅</h3><span className="text-xs text-tertiary">실시간 시연 모드</span></div>
                  <div className="max-h-56 space-y-3 overflow-y-auto pr-1">
                    {chatMessages.length === 0 ? <p className="text-xs text-outline">초기화되었습니다. 메시지를 입력해 로그를 생성하세요.</p> : null}
                    {chatMessages.map((message) => <ChatMessage key={message.id} message={message} />)}
                  </div>
                  <form onSubmit={submitChat} className="mt-4 flex gap-2">
                    <input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="메시지 입력" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs outline-none focus:border-primary/40" />
                    <button className="rounded-xl bg-primary p-2 text-black"><Send className="h-4 w-4" /></button>
                  </form>
                </div>
              </aside>
            </div>
          </div>
        </Reveal>
      </section>

      {selectedTaskId && tasks[selectedTaskId] ? (
        <TaskModal
          task={tasks[selectedTaskId]}
          onClose={() => setSelectedTaskId(null)}
          onSave={(partial) => updatePresentationTask(selectedTaskId, partial)}
        />
      ) : null}

      <section className="relative z-10 px-6 py-24 sm:px-10 lg:px-16">
        <Reveal className="mx-auto max-w-7xl">
          <SectionLabel label="실시간 협업" />
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <h2 className="text-4xl font-black tracking-[-0.05em] text-white sm:text-6xl">실시간 협업은 이벤트 흐름으로 설명합니다.</h2>
              <p className="mt-5 text-on-surface-variant">카드 생성, 이동, 채팅 메시지, 보드 동기화가 하나의 이벤트 로그로 누적되어 협업 상태를 시각적으로 확인할 수 있습니다.</p>
            </div>
            <EventLog logs={logs.length ? logs : baseLogs} large />
          </div>
        </Reveal>
      </section>

      <section className="relative z-10 px-6 py-24 sm:px-10 lg:px-16">
        <Reveal className="mx-auto max-w-7xl">
          <SectionLabel label="아키텍처" />
          <h2 className="max-w-4xl text-4xl font-black tracking-[-0.05em] text-white sm:text-6xl">시스템 아키텍처는 서비스 흐름 중심으로 시각화합니다.</h2>
          <div className="mt-12 grid gap-4 lg:grid-cols-5">
            {architectureNodes.map((node, index) => (
              <div key={node.label} className="relative rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur">
                <div className="mb-8 inline-flex rounded-2xl bg-tertiary/15 p-3 text-tertiary">{node.icon}</div>
                <h3 className="text-xl font-black text-white">{node.label}</h3>
                <p className="mt-2 text-sm text-outline">{node.detail}</p>
                {index < architectureNodes.length - 1 ? <ChevronRight className="absolute -right-5 top-1/2 hidden h-8 w-8 -translate-y-1/2 text-primary lg:block" /> : null}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="relative z-10 px-6 py-24 sm:px-10 lg:px-16">
        <Reveal className="mx-auto max-w-7xl">
          <SectionLabel label="기술 스택" />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {techStacks.map((stack) => (
              <article key={stack.group} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur">
                <h3 className="mb-5 text-xl font-black text-white">{stack.group}</h3>
                <div className="space-y-3">
                  {stack.items.map((item) => <div key={item} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-on-surface-variant">{item}</div>)}
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="relative z-10 px-6 py-24 sm:px-10 lg:px-16">
        <Reveal className="mx-auto max-w-6xl">
          <SectionLabel label="프로젝트 결과" />
          <h2 className="text-4xl font-black tracking-[-0.05em] text-white sm:text-6xl">구현 성과와 학습 내용, 향후 개선 방향을 정리했습니다.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <StatsCard title="프로젝트 성과" value="AI 기반 협업 칸반 시스템 MVP 구현" note="프로젝트 관리, 칸반 보드, AI Task 생성, 팀 채팅, 실시간 협업 흐름을 하나의 서비스로 구현했습니다." />
            <StatsCard title="배운 점" value="REST API와 WebSocket 기반 협업 구조 이해" note="Next.js 클라이언트와 Express 서버, MongoDB, Socket.io를 연결하며 실시간 상태 동기화 흐름을 학습했습니다." />
            <StatsCard title="향후 개선" value="AI 추천 고도화 및 알림 자동화 강화" note="AI Task 추천 정확도 개선, 프로젝트 권한 관리 강화, 알림 시스템 고도화, 배포 안정화가 향후 개선 방향입니다." />
          </div>
        </Reveal>
      </section>

      <section className="relative z-10 px-6 py-28 sm:px-10 lg:px-16">
        <Reveal className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(195,192,255,0.22),rgba(255,255,255,0.045)_42%,rgba(255,255,255,0.03))] p-10 text-center shadow-2xl backdrop-blur lg:p-16">
          <div className="mx-auto mb-8 inline-flex rounded-3xl bg-primary/15 p-4 text-primary"><GitBranch className="h-8 w-8" /></div>
          <h2 className="text-4xl font-black tracking-[-0.05em] text-white sm:text-6xl">발표가 끝나면 실제 서비스로 이동합니다.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-on-surface-variant">이 페이지는 발표 및 시연 전용입니다. 실제 서비스 데이터는 대시보드에서 확인합니다.</p>
          <Link href="/dashboard" className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-black text-black transition hover:scale-105">
            실제 서비스 보기 <CheckCircle2 className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>
    </main>
  );
}

function SectionLabel({ label }: { label: string }) {
  return <p className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-tertiary">{label}</p>;
}

function EventLog({ logs, large = false }: { logs: PresentationLog[]; large?: boolean }) {
  return (
    <div className={`rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur ${large ? "p-7" : ""}`}>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-black text-white">이벤트 로그</h3>
        <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-200">실시간 흐름</span>
      </div>
      <div className="space-y-3">
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
