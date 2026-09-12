import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface Project {
  number: string;
  status: string;
  tone: "accent" | "muted";
  title: string;
  description: string;
  tags: string[];
}

const PROJECTS: Project[] = [
  {
    number: "01",
    status: "Live",
    tone: "accent",
    title: "Sterling Capital Exchange",
    description: "A simulated trading platform built to actually hold up.",
    tags: ["Next.js", "Supabase", "Vercel"],
  },
  {
    number: "02",
    status: "In progress",
    tone: "muted",
    title: "Freight & Logistics Platform",
    description: "Three apps, one shared backend, kept in sync.",
    tags: ["Turborepo", "Next.js", "Postgres"],
  },
  {
    number: "03",
    status: "In active use",
    tone: "accent",
    title: "Dealership Operations Platform",
    description: "Inventory and CRM built around how the team already works.",
    tags: ["React", "Node", "WhatsApp API"],
  },
  {
    number: "04",
    status: "Live",
    tone: "accent",
    title: "Stonebridge Builders",
    description: "A CMS that lives in git, not a subscription.",
    tags: ["Next.js", "Markdown", "Netlify"],
  },
];

export function Projects() {
  return (
    <section
      id="work"
      className="px-[clamp(24px,4.5vw,64px)] pt-[clamp(40px,4.5vw,72px)] pb-[clamp(40px,4.5vw,72px)]"
    >
      <div
        className="mb-[clamp(40px,5vw,64px)] grid grid-cols-1 gap-x-6 gap-y-3 border-t pt-5 lg:grid-cols-12"
        style={{ borderColor: "var(--ink)" }}
      >
        <SectionLabel number="02" className="lg:col-span-2 lg:col-start-1">
          Projects
        </SectionLabel>
        <span
          className="text-[10px] uppercase tracking-[0.16em] lg:col-start-9 lg:col-span-1 lg:justify-self-end"
          style={{ color: "var(--faint)" }}
        >
          PO / 2026
        </span>
        <p
          className="text-[16px] leading-[1.6] text-pretty lg:col-start-10 lg:col-span-3 lg:self-end"
          style={{ color: "var(--muted)" }}
        >
          Click any card for the technical detail: the problem, the decisions, the parts that broke.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 xl:grid-cols-4">
        {PROJECTS.map((project) => (
          <Card key={project.number} href="#work" interactive>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px]" style={{ color: "var(--accent)" }}>
                {project.number}
              </span>
              <Badge tone={project.tone}>{project.status}</Badge>
            </div>

            <h3 className="font-display mt-5 mb-2 text-[25px] leading-[1.15] font-normal tracking-[-0.01em]">
              {project.title}
            </h3>

            <p className="mb-[22px] text-[13.5px] leading-[1.5] text-pretty" style={{ color: "var(--muted)" }}>
              {project.description}
            </p>

            <div className="flex-1" />

            <div className="mb-4 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="tag">
                  {tag}
                </Badge>
              ))}
            </div>

            <div
              className="border-t pt-3.5 text-[10px] uppercase tracking-[0.16em]"
              style={{ borderColor: "var(--rule)", color: "var(--accent)" }}
            >
              Read →
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
