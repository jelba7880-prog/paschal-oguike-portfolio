import { Badge } from "@/components/ui/Badge";
import { GlassScrim } from "@/components/ui/GlassScrim";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface Entry {
  date: string;
  title: string;
  description: string;
  tags: string[];
}

const ENTRIES: Entry[] = [
  {
    date: "2025 —",
    title: "Independent — full-stack & systems architect",
    description:
      "Building products for small businesses and founders who need the whole thing, not a ticket queue: schema, app, deploy, handover.",
    tags: ["Product engineering", "Next.js", "Supabase"],
  },
  {
    date: "2026",
    title: "PZ Autos — ongoing",
    description:
      "The dealership platform I keep extending — inventory, listings and showcase links — with an eye on opening it to other dealers beyond my own lot.",
    tags: ["Local-first", "Postgres", "TypeScript"],
  },
  {
    date: "2023 — 2025",
    title: "Agency & contract work",
    description:
      "Marketing sites, dashboards, and integrations under real deadlines — where the habit of specifying before building started paying for itself.",
    tags: ["React", "Node", "Client delivery"],
  },
];

export function TrackRecord() {
  return (
    <section
      id="record"
      className="px-[clamp(24px,4.5vw,64px)] pt-[clamp(56px,6vw,88px)] pb-[clamp(56px,6vw,88px)]"
    >
      <div
        className="mb-[clamp(40px,5vw,64px)] grid grid-cols-1 gap-x-6 gap-y-3 border-t pt-8 lg:grid-cols-12"
        style={{ borderColor: "var(--ink)" }}
      >
        <SectionLabel number="05" className="lg:col-span-2 lg:col-start-1">
          Track record
        </SectionLabel>
        <h2 className="font-display m-0 text-[clamp(30px,3.4vw,50px)] leading-[1.12] font-light tracking-[-0.01em] lg:col-start-3 lg:col-span-7">
          The work behind the work.
        </h2>
        <p
          className="text-[16px] leading-[1.6] text-pretty lg:col-start-10 lg:col-span-3 lg:self-end"
          style={{ color: "var(--muted)" }}
        >
          A plain record of where the practice came from.
        </p>
      </div>

      <div className="relative z-[21] p-[18px]">
        <GlassScrim />
        <ol className="relative m-0 list-none p-0">
          {ENTRIES.map((entry, index) => (
            <li
              key={entry.title}
              className={`grid grid-cols-1 gap-x-6 gap-y-3 border-t py-[26px] lg:grid-cols-12 ${
                index === ENTRIES.length - 1 ? "border-b" : ""
              }`}
              style={{ borderColor: "var(--rule)" }}
            >
              <div
                className="text-[11px] tracking-[0.12em] lg:col-start-1 lg:col-span-2"
                style={{ color: "var(--muted)" }}
              >
                {entry.date}
              </div>
              <div className="lg:col-start-3 lg:col-span-5">
                <h3 className="m-0 mb-1.5 text-[22px] font-medium">{entry.title}</h3>
                <p className="m-0 text-[15px] leading-[1.6] text-pretty" style={{ color: "var(--body)" }}>
                  {entry.description}
                </p>
              </div>
              <div className="flex flex-wrap content-start gap-2 lg:col-start-9 lg:col-span-4">
                {entry.tags.map((tag) => (
                  <Badge key={tag} variant="tag">
                    {tag}
                  </Badge>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
