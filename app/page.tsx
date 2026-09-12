import { Hero } from "@/components/Hero";
import { Philosophy } from "@/components/Philosophy";
import { Projects } from "@/components/Projects";
import { SkillsMatrix } from "@/components/SkillsMatrix";

export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <Philosophy />
      <SkillsMatrix />
    </main>
  );
}
