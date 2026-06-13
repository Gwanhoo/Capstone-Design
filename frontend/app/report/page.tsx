import fs from "fs";
import path from "path";
import Image from "next/image";
import { MarkdownRenderer } from "@/components/report/MarkdownRenderer";
import { PrintButton } from "@/components/report/PrintButton";

type ReportSection = {
  id: string;
  title: string;
  markdown: string;
  pageBreak?: boolean;
};

const tocItems = [
  { id: "project-introduction", title: "프로젝트 소개" },
  { id: "system-architecture", title: "시스템 구성도" },
  { id: "analysis-design", title: "분석 및 설계 내용" },
  { id: "implementation-result", title: "구현 결과" },
  { id: "appendix", title: "기타" }
];

const implementationScreenshots = [
  {
    title: "로그인",
    image: "/report/login.png",
    description: "이메일과 비밀번호를 입력해 협업 공간에 접근하는 인증 화면입니다."
  },
  {
    title: "대시보드",
    image: "/report/dashboard.png",
    description: "참여 중인 프로젝트, 받은 초대, 프로젝트 통계를 한 화면에서 확인합니다."
  },
  {
    title: "프로젝트 생성",
    image: "/report/project-create.png",
    description: "프로젝트 이름과 설명을 입력하면 협업용 칸반 보드가 생성됩니다."
  },
  {
    title: "프로젝트 초대",
    image: "/report/project-invite.png",
    description: "프로젝트 멤버 관리 패널에서 이메일 기반 초대와 소유자 정보를 관리합니다."
  },
  {
    title: "칸반 보드",
    image: "/report/kanban-board.png",
    description: "할 일, 진행 중, 완료 컬럼과 카드 목록, 프로젝트 진행률을 함께 보여줍니다."
  },
  {
    title: "실시간 채팅",
    image: "/report/chat.png",
    description: "보드 우측 채팅 패널에서 프로젝트 참여자가 메시지를 실시간으로 공유합니다."
  },
  {
    title: "메모",
    image: "/report/memo.png",
    description: "카드별 메모 모달에서 작업 관련 기록을 작성하고 저장합니다."
  },
  {
    title: "AI 프로젝트 분석",
    image: "/report/ai-analysis.png",
    description: "AI가 칸반 보드와 메모를 기반으로 현재 상태, 위험 요소, 추천 작업을 요약합니다."
  }
];

const fallbackReport = `# AI 기반 실시간 협업 칸반 시스템

> REPORT_CONTENT.md 파일을 찾을 수 없어 README.md 내용을 보고서 원문으로 사용했습니다.

## 1) 프로젝트 소개
- 팀 단위 프로젝트에서 업무 생성, 진행 상태 공유, 커뮤니케이션을 하나의 보드에서 관리합니다.

## 4) 시스템 아키텍처
\`\`\`mermaid
flowchart LR
  C["Next.js Client"] --> R["Express REST API"]
  C <--> S["Socket.io Gateway"]
  R --> DB[("MongoDB")]
  R --> O["OpenAI API"]
\`\`\`
`;

function readReportContent() {
  const candidates = [
    path.join(process.cwd(), "..", "REPORT_CONTENT.md"),
    path.join(process.cwd(), "REPORT_CONTENT.md"),
    path.join(process.cwd(), "..", "README.md"),
    path.join(process.cwd(), "README.md")
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return fs.readFileSync(candidate, "utf-8");
    }
  }

  return fallbackReport;
}

function normalizeTitle(title: string) {
  return title.replace(/^\d+\)\s*/, "").trim();
}

function getDocumentTitle(markdown: string) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? "캡스톤 디자인 완료보고서";
}

function cleanInlineMarkdown(value: string) {
  return value.replace(/\*\*/g, "").replace(/`/g, "");
}

function getLead(markdown: string) {
  const lead = markdown.match(/^>\s+(.+)$/m)?.[1]?.trim() ?? "AI 기반 실시간 협업 칸반 시스템 완료보고서";
  return cleanInlineMarkdown(lead);
}

function splitBySecondLevelHeading(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const sections = new Map<string, string>();
  let currentTitle = "";
  let currentLines: string[] = [];

  const flush = () => {
    if (!currentTitle) return;
    sections.set(normalizeTitle(currentTitle), [`## ${normalizeTitle(currentTitle)}`, ...currentLines].join("\n").trim());
  };

  for (const line of lines) {
    const match = line.match(/^##\s+(.+)$/);
    if (match) {
      flush();
      currentTitle = match[1].trim();
      currentLines = [];
    } else if (currentTitle) {
      currentLines.push(line);
    }
  }

  flush();
  return sections;
}

function combineSections(sectionMap: Map<string, string>, titles: string[]) {
  return titles
    .map((title) => sectionMap.get(title))
    .filter(Boolean)
    .join("\n\n---\n\n");
}

function createReportSections(markdown: string): ReportSection[] {
  const sectionMap = splitBySecondLevelHeading(markdown);

  return [
    {
      id: "project-introduction",
      title: "프로젝트 소개",
      markdown: combineSections(sectionMap, ["프로젝트 소개", "주요 기능", "기술 스택"])
    },
    {
      id: "system-architecture",
      title: "시스템 구성도",
      markdown: combineSections(sectionMap, ["시스템 아키텍처", "프로젝트 구조"]),
      pageBreak: true
    },
    {
      id: "analysis-design",
      title: "분석 및 설계 내용",
      markdown: combineSections(sectionMap, ["핵심 기능 흐름", "데이터 모델 요약", "API 구조 요약", "실시간 처리 구조"]),
      pageBreak: true
    },
    {
      id: "implementation-result",
      title: "구현 결과",
      markdown: "",
      pageBreak: true
    },
    {
      id: "appendix",
      title: "기타",
      markdown: combineSections(sectionMap, ["트러블슈팅(구현 기반)", "실행 방법", "배운 점 / 개선 방향", "참고 문서"]),
      pageBreak: true
    }
  ];
}

function ImplementationScreenshot({ title, image, description, index }: { title: string; image: string; description: string; index: number }) {
  return (
    <figure className="implementation-screenshot">
      <div className="implementation-screenshot-image-wrap">
        <Image src={image} alt={`${title} 구현 화면`} fill sizes="(max-width: 780px) 100vw, 50vw" style={{ objectFit: "contain" }} />
      </div>
      <figcaption>
        <span>Screenshot {String(index + 1).padStart(2, "0")}</span>
        <strong>{title}</strong>
        <p>{description}</p>
      </figcaption>
    </figure>
  );
}

export default function ReportPage() {
  const markdown = readReportContent();
  const title = getDocumentTitle(markdown);
  const lead = getLead(markdown);
  const sections = createReportSections(markdown);

  return (
    <main className="report-root bg-neutral-100 text-neutral-950">
      <PrintButton />
      <article className="report-paper mx-auto bg-white shadow-2xl print:shadow-none">
        <section className="report-cover">
          <p className="report-kicker">Capstone Design Final Report</p>
          <h1>{title}</h1>
          <p>{lead}</p>
          <dl>
            <div><dt>문서 유형</dt><dd>캡스톤 디자인 완료보고서</dd></div>
            <div><dt>제출 형식</dt><dd>웹 페이지 인쇄 PDF</dd></div>
            <div><dt>작성 기준</dt><dd>REPORT_CONTENT.md</dd></div>
            <div><dt>학번</dt><dd>202301078</dd></div>
            <div><dt>성명</dt><dd>김관호</dd></div>
          </dl>
        </section>

        <nav className="report-toc" aria-label="보고서 목차">
          <h2>목차</h2>
          <ol>
            {tocItems.map((item, index) => (
              <li key={item.id}>
                <a href={`#${item.id}`}><span>{index + 1}</span>{item.title}</a>
              </li>
            ))}
          </ol>
        </nav>

        {sections.map((section, index) => (
          <section key={section.id} id={section.id} className={section.pageBreak ? "report-section page-break-before" : "report-section"}>
            <div className="report-section-heading">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{section.title}</h2>
            </div>

            {section.id === "implementation-result" ? (
              <div className="implementation-section">
                <p className="implementation-note">
                  구현 결과는 주요 사용자 흐름별 화면 단위로 정리합니다.
                </p>
                <div className="screenshot-grid">
                  {implementationScreenshots.map((screenshot, screenshotIndex) => (
                    <ImplementationScreenshot key={screenshot.title} {...screenshot} index={screenshotIndex} />
                  ))}
                </div>
              </div>
            ) : section.markdown ? (
              <MarkdownRenderer markdown={section.markdown} />
            ) : (
              <p className="text-neutral-600">해당 섹션에 연결할 REPORT_CONTENT.md 원문을 찾지 못했습니다.</p>
            )}
          </section>
        ))}
      </article>
    </main>
  );
}
