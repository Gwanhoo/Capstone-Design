import fs from "fs";
import path from "path";
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

const screenshotPlaceholders = [
  "로그인",
  "대시보드",
  "프로젝트 생성",
  "프로젝트 초대",
  "칸반 보드",
  "Task 관리",
  "실시간 채팅",
  "메모",
  "AI 작업 분할",
  "AI 프로젝트 분석"
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

function ScreenshotPlaceholder({ title, index }: { title: string; index: number }) {
  return (
    <figure className="screenshot-placeholder">
      <div className="screenshot-placeholder-frame">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Screenshot {String(index + 1).padStart(2, "0")}</span>
        <strong>{title}</strong>
        <p>추후 실제 구현 화면 이미지를 이 영역에 삽입할 수 있습니다.</p>
      </div>
      <figcaption>{title} 화면</figcaption>
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
                  구현 결과는 주요 사용자 흐름별 화면 단위로 정리합니다. 아래 영역은 이미지 교체가 쉽도록 독립 Placeholder로 구성했습니다.
                </p>
                <div className="screenshot-grid">
                  {screenshotPlaceholders.map((placeholder, placeholderIndex) => (
                    <ScreenshotPlaceholder key={placeholder} title={placeholder} index={placeholderIndex} />
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
