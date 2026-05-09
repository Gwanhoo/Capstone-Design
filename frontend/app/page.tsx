import { Cta } from "@/components/landing/cta";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { KanbanPreview } from "@/components/landing/kanban-preview";
import { Navbar } from "@/components/landing/navbar";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface text-on-surface" style={{ fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif" }}>
      <Navbar />
      <div className="pt-20">
        <Hero />
        <Features />
        <KanbanPreview />
        <HowItWorks />
        <Cta />
      </div>
      <Footer />
    </main>
  );
}
