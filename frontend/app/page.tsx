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
      <Navbar />
      <Hero />
      <Features />
      <KanbanPreview />
      <HowItWorks />
      <Cta />
      <Footer />
    </main>
  );
}
