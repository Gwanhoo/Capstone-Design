import type { Metadata } from "next";
import { InteractivePresentation } from "@/components/presentation/InteractivePresentation";

export const metadata: Metadata = {
  title: "Kanban AI Presentation | 인터랙티브 발표 페이지",
  description: "Kanban AI 캡스톤 디자인 발표 및 시연 전용 인터랙티브 프레젠테이션"
};

export default function PresentationPage() {
  return <InteractivePresentation />;
}
