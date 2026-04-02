import { Cta } from "@/components/landing/cta";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { KanbanPreview } from "@/components/landing/kanban-preview";
import { Navbar } from "@/components/landing/navbar";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#131313] text-[#e5e2e1]">
      {/* Top Navigation */}
      <Navbar />

      {/* Core landing flow */}
      <Hero />
      <Features />
      <KanbanPreview />
      <HowItWorks />
      <Cta />

      {/* Footer */}
      <Footer />
    </main>
  );
}