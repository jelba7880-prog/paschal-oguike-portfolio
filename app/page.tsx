import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Notes } from "@/components/Notes";
import { Projects } from "@/components/Projects";
import { SkillsMatrix } from "@/components/SkillsMatrix";
import { TrackRecord } from "@/components/TrackRecord";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <SkillsMatrix />
      <TrackRecord />
      <Notes />
      <Contact />
      <Footer />
    </main>
  );
}
