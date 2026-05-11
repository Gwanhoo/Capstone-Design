import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ProjectItem } from "@/components/dashboard/types";

const PROJECTS: ProjectItem[] = [
  {
    id: 1,
    name: "옵시디언 포지 코어",
    status: "진행중",
    description: "AI 코드 리뷰 흐름과 실시간 협업 편집기를 통합하는 메인 프로젝트입니다.",
    progress: 74,
    members: 8,
    updatedAt: "2026.05.10"
  },
  {
    id: 2,
    name: "문서 자동화 허브",
    status: "완료",
    description: "요구사항 문서와 회의록을 자동 분류하고 요약하는 지식 관리 파이프라인 구축.",
    progress: 100,
    members: 5,
    updatedAt: "2026.05.08"
  },
  {
    id: 3,
    name: "테스트 시나리오 엔진",
    status: "대기중",
    description: "AI 추천 기반의 회귀 테스트 시나리오 생성 기능을 다음 스프린트에 반영 예정입니다.",
    progress: 32,
    members: 4,
    updatedAt: "2026.05.07"
  }
];

const STATS = [
  { title: "진행중 프로젝트", value: "12", note: "지난주 대비 +2" },
  { title: "완료된 작업", value: "84", note: "이번 주 누적" },
  { title: "AI 추천 작업", value: "19", note: "우선순위 높음 6건" }
];

const SHOW_EMPTY_STATE = false;

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardHeader />

      <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STATS.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </section>

      {SHOW_EMPTY_STATE ? (
        <EmptyState />
      ) : (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>
      )}
    </DashboardLayout>
  );
}
