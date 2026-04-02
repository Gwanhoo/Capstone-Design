import { Hero } from "@/components/landing/hero";
import { KanbanPreview } from "@/components/landing/kanban-preview";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#131313] text-[#e5e2e1]">
      <Hero />
      <KanbanPreview />
    </main>
  );
}
