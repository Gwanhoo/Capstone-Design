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
  Layers3,
  MessageSquareText,
  Network,
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

const initialColumns: KanbanColumnType[] = [
  { id: "todo", title: "할 일", tone: "slate", taskIds: [] },
  { id: "doing", title: "진행 중", tone: "primary", taskIds: [] },
  { id: "done", title: "완료", tone: "tertiary", taskIds: [] }
];

const baseLogs: PresentationLog[] = [
  { id: "log-ready", label: "발표 모드 준비 완료", detail: "발표 전용 안전 모드로 실행 중", tone: "primary" },
  { id: "log-socket", label: "시연 이벤트 대기", detail: "AI 기능과 협업 흐름을 한 화면에서 설명", tone: "tertiary" }
];

const features: FeatureCard[] = [
  { title: "AI 작업 분해", description: "프롬프트를 실행 가능한 Task로 전환", icon: <Bot className="h-5 w-5" /> },
  { title: "AI 보드 분석", description: "진행률과 병목을 요약해 다음 행동 제안", icon: <Sparkles className="h-5 w-5" /> },
  { title: "AI 메모 요약", description: "회의·이슈·아이디어 메모에서 맥락 추출", icon: <MessageSquareText className="h-5 w-5" /> },
  { title: "실시간 협업", description: "카드 이동, 채팅, 알림 이벤트 동기화", icon: <Zap className="h-5 w-5" /> },
  { title: "프로젝트 관리", description: "초대, 진행률, 보관까지 프로젝트 단위 관리", icon: <Users className="h-5 w-5" /> },
  { title: "칸반 보드", description: "할 일·진행 중·완료 흐름으로 작업 추적", icon: <Layers3 className="h-5 w-5" /> }
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

const aiHighlights = [
  { title: "AI Task Decomposition", description: "목표를 작은 작업으로 나누고 보드에 배치" },
  { title: "AI Board Analysis", description: "진행률, 병목, 우선순위를 한 문장으로 정리" },
  { title: "AI Memo Summary", description: "누적 메모에서 회의록·이슈·다음 작업 추출" }
];

const boardInsights = [
  { label: "진행률", value: "68%", note: "핵심 시연 기능 구현 완료" },
  { label: "병목", value: "초대 UX", note: "수락 플로우 안내 문구 개선 필요" },
  { label: "추천", value: "메모 요약", note: "발표 시 AI 보드 분석과 함께 시연" }
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
    ? ["발표 흐름 정리", "핵심 기능 시연 순서 구성", "AI 메모 요약 데모 준비", "최종 발표 리허설"]
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
  const [logs, setLogs] = useState<PresentationLog[]>(baseLogs);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMemoSummaryVisible, setIsMemoSummaryVisible] = useState(false);
  const [isSummarizingMemos, setIsSummarizingMemos] = useState(false);

  const orderedColumns = useMemo(
    () => columns.map((column) => ({ ...column, taskIds: column.taskIds.filter((taskId) => tasks[taskId]) })),
    [columns, tasks]
  );

  const addLog = (label: string, detail: string, tone: PresentationLog["tone"] = "primary") => {
    setLogs((current) => [{ id: `${Date.now()}-${label}`, label, detail, tone }, ...current].slice(0, 5));
  };

  const resetPresentation = () => {
    setPrompt("캡스톤 발표 준비 작업을 생성해줘");
    setColumns(initialColumns);
    setTasks({});
    setLogs(baseLogs);
    setIsMemoSummaryVisible(false);
    setIsSummarizingMemos(false);
  };

  const generateTasks = (event: FormEvent) => {
    event.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isGenerating) return;

    setIsGenerating(true);
    addLog("AI 작업 분해 요청", `프롬프트: ${trimmedPrompt}`, "tertiary");

    window.setTimeout(() => {
      const generated = createTasksFromPrompt(trimmedPrompt);
      const nextTasks = generated.reduce<Record<string, Task>>((acc, task) => ({ ...acc, [task.id]: task }), {});
      setTasks(nextTasks);
      setColumns(initialColumns.map((column) => (column.id === "todo" ? { ...column, taskIds: generated.map((task) => task.id) } : column)));
      addLog("AI 작업 분해 완료", `${generated.length}개 발표 Task 생성`, "success");
      addLog("AI 보드 분석", "진행률 68%, 초대 UX 개선 우선", "primary");
      setIsGenerating(false);
    }, 520);
  };

  const generateMemoSummary = () => {
    if (isSummarizingMemos) return;

    setIsSummarizingMemos(true);
    addLog("AI 메모 요약 요청", `${demoMemos.length}개 프로젝트 메모 분석`, "tertiary");

    window.setTimeout(() => {
      setIsMemoSummaryVisible(true);
      setIsSummarizingMemos(false);
      addLog("AI 메모 요약 완료", "회의록, 진행 이슈, 다음 작업 방향 표시", "success");
    }, 420);
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
            <p className="mt-5 max-w-2xl text-xl leading-8 text-on-surface-variant sm:text-2xl">AI 기반 실시간 협업 칸반 프로젝트 관리 시스템</p>
            <div className="mt-7 grid max-w-2xl gap-3 text-sm text-on-surface-variant sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur"><span className="text-outline">팀 정보</span><strong className="mt-1 block text-white">Kanban AI 개발팀</strong></div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur"><span className="text-outline">발표자</span><strong className="mt-1 block text-white">김관호 · 시스템 설계 및 구현</strong></div>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#ai-presentation" className="rounded-full bg-primary px-6 py-3 text-sm font-black text-black transition hover:scale-105 hover:brightness-110">AI 통합 시연 바로가기</a>
              <span className="inline-flex items-center gap-2 text-sm text-outline"><ArrowDown className="h-4 w-4 animate-bounce" /> 6개 섹션 단방향 스크롤</span>
            </div>
          </Reveal>

          <Reveal className="lg:translate-y-6">
            <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur-2xl">
              <div className="absolute -right-5 -top-5 rounded-2xl border border-tertiary/30 bg-tertiary/10 px-4 py-3 text-xs font-bold text-tertiary shadow-xl backdrop-blur">발표 전용 안전 모드</div>
              <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-4">
                <div className="mb-4 flex items-center justify-between"><span className="text-sm font-bold text-white">Kanban AI 요약 뷰</span><span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-200">Live Demo</span></div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {features.slice(0, 3).map((feature) => (
                    <div key={feature.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="mb-4 inline-flex rounded-xl bg-primary/15 p-2 text-primary">{feature.icon}</div>
                      <h3 className="text-sm font-black text-white">{feature.title}</h3>
                      <p className="mt-2 text-xs leading-5 text-outline">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative z-10 px-6 py-16 sm:px-10 lg:px-16">
        <Reveal className="mx-auto max-w-6xl">
          <SectionLabel label="Problem" />
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <h2 className="text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">작업 분해, 협업 맥락, 진행 판단을 한 서비스 안에서 연결합니다.</h2>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {["작업 분해 반복", "보드와 채팅 맥락 분리", "회의·이슈 기록 분산"].map((text, index) => (
                <div key={text} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-sm text-on-surface-variant backdrop-blur">
                  <span className="mr-3 text-base font-black text-primary">0{index + 1}</span>{text}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="relative z-10 px-6 py-16 sm:px-10 lg:px-16">
        <Reveal className="mx-auto max-w-7xl">
          <SectionLabel label="Core Features" />
          <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <h2 className="max-w-3xl text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">기능은 6개 카드로 요약하고, 상세 설명은 AI 통합 시연에서 처리합니다.</h2>
            <p className="max-w-md text-sm leading-6 text-outline">반복 설명을 줄이고 발표자가 핵심 가치만 빠르게 짚을 수 있도록 구성했습니다.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="group rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/[0.07]">
                <div className="mb-4 inline-flex rounded-xl bg-primary/15 p-2 text-primary transition group-hover:scale-110">{feature.icon}</div>
                <h3 className="text-lg font-black text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-5 text-on-surface-variant">{feature.description}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      <section id="ai-presentation" className="relative z-10 px-4 py-16 sm:px-8 lg:px-12">
        <Reveal className="mx-auto max-w-[1500px]">
          <div className="rounded-[2rem] border border-white/10 bg-[#0b0d14]/90 p-4 shadow-2xl backdrop-blur-2xl lg:p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <SectionLabel label="AI 통합 시연" />
                <h2 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-5xl">작업 분해 · 보드 분석 · 메모 요약을 한 화면에서 설명합니다.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-outline">실제 API 호출 없이 발표용 mock 데이터로 AI 흐름만 빠르게 보여줍니다.</p>
              </div>
              <button onClick={resetPresentation} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-on-surface-variant transition hover:border-error/40 hover:text-error">
                <RefreshCcw className="h-4 w-4" /> 시연 초기화
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-3">
              {aiHighlights.map((item) => (
                <div key={item.title} className="rounded-2xl border border-primary/20 bg-primary/[0.06] p-4">
                  <h3 className="text-sm font-black text-primary">{item.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-on-surface-variant">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-5 xl:grid-cols-[0.9fr_1fr_1fr_0.9fr]">
              <form onSubmit={generateTasks} className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-primary"><Sparkles className="h-4 w-4" /> AI 작업 분해</div>
                <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={4} placeholder="예: 캡스톤 발표 준비 작업을 생성해줘" className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15" />
                <button type="submit" disabled={isGenerating || !prompt.trim()} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-black text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">
                  {isGenerating ? "AI 분석 중..." : "AI Task 생성"}<Sparkles className="h-4 w-4" />
                </button>
                <div className="mt-4 space-y-2">
                  {orderedColumns[0].taskIds.length === 0 ? <p className="rounded-2xl border border-dashed border-white/10 p-4 text-xs leading-5 text-outline">버튼을 누르면 발표용 Task가 생성됩니다.</p> : null}
                  {orderedColumns[0].taskIds.map((taskId) => (
                    <div key={taskId} className="rounded-2xl border border-white/10 bg-black/25 p-3 text-sm font-semibold text-white">{tasks[taskId].title}</div>
                  ))}
                </div>
              </form>

              <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-black text-white"><Layers3 className="h-4 w-4 text-primary" /> 보드 상태 요약</div>
                <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                  {initialColumns.map((column, index) => (
                    <div key={column.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-semibold text-on-surface"><span className={`h-2 w-2 rounded-full ${columnTone[column.tone]}`} />{column.title}</span>
                        <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] text-on-surface-variant">{orderedColumns[index]?.taskIds.length ?? 0}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${index === 0 ? 68 : index === 1 ? 42 : 24}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(195,192,255,0.16),rgba(255,255,255,0.045)_46%,rgba(0,0,0,0.18))] p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-black text-primary"><Bot className="h-4 w-4" /> AI 보드 분석</div>
                <div className="space-y-3">
                  {boardInsights.map((insight) => (
                    <div key={insight.label} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-bold text-outline">{insight.label}</span>
                        <strong className="text-lg text-white">{insight.value}</strong>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-on-surface-variant">{insight.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur">
                <div className="mb-3 flex items-center gap-2 text-sm font-black text-primary"><MessageSquareText className="h-4 w-4" /> AI 메모 요약</div>
                <div className="mb-3 space-y-2">
                  {demoMemos.slice(0, 3).map((memo, index) => (
                    <div key={memo} className="rounded-2xl border border-white/10 bg-black/25 p-3 text-xs leading-5 text-on-surface-variant"><span className="font-bold text-tertiary">M{index + 1}</span> {memo}</div>
                  ))}
                </div>
                <button type="button" onClick={generateMemoSummary} disabled={isSummarizingMemos} className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-black text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
                  {isSummarizingMemos ? "요약 중..." : "AI 요약 생성"}<Sparkles className="h-4 w-4" />
                </button>
                {isMemoSummaryVisible ? (
                  <div className="rounded-2xl border border-primary/30 bg-primary/[0.08] p-4 text-xs leading-6 text-on-surface">
                    {demoMemoSummary.split("\n").map((line) => <p key={line}>{line}</p>)}
                  </div>
                ) : <div className="rounded-2xl border border-dashed border-white/10 p-4 text-center text-xs leading-5 text-outline">버튼 클릭 시 mock 요약 표시</div>}
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
              <EventLog logs={logs.length ? logs : baseLogs} />
              <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur">
                <h3 className="mb-3 text-sm font-black text-white">발표 포인트</h3>
                <div className="grid gap-2 text-xs leading-5 text-outline sm:grid-cols-3 lg:grid-cols-1">
                  <span className="rounded-2xl border border-white/10 bg-black/20 p-3">Task 생성으로 시작</span>
                  <span className="rounded-2xl border border-white/10 bg-black/20 p-3">Board 분석으로 상황 판단</span>
                  <span className="rounded-2xl border border-white/10 bg-black/20 p-3">Memo 요약으로 맥락 공유</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="relative z-10 px-6 py-16 sm:px-10 lg:px-16">
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

      <section className="relative z-10 px-6 py-20 sm:px-10 lg:px-16">
        <Reveal className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(195,192,255,0.22),rgba(255,255,255,0.045)_42%,rgba(255,255,255,0.03))] p-8 shadow-2xl backdrop-blur lg:p-10">
          <SectionLabel label="프로젝트 결과" />
          <h2 className="max-w-4xl text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">MVP 구현 결과와 다음 개선 방향을 한 번에 정리합니다.</h2>
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

function EventLog({ logs, large = false }: { logs: PresentationLog[]; large?: boolean }) {
  return (
    <div className={`rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur ${large ? "p-7" : ""}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-black text-white">이벤트 로그</h3>
        <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-200">시연 흐름</span>
      </div>
      <div className="space-y-2">
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
