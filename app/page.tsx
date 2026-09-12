import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Notes } from "@/components/Notes";
import { Philosophy } from "@/components/Philosophy";
import { Projects } from "@/components/Projects";
import { SkillsMatrix } from "@/components/SkillsMatrix";
import { TrackRecord } from "@/components/TrackRecord";

export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <SkillsMatrix />
      <Philosophy />
      <TrackRecord />
      <Notes />
      <Contact />
      <Footer />
    </main>
  );
}
