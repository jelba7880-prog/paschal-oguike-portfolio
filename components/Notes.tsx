import { SectionLabel } from "@/components/ui/SectionLabel";

interface Note {
  title: string;
  description: string;
  date: string;
}

const NOTES: Note[] = [
  {
    title: "Specs are the new source code",
    description: "If an agent can't build it from the doc, the doc was never finished.",
    date: "Oct 1, 2025",
  },
  {
    title: "Row-level security is a design decision",
    description: "Why I model Supabase permissions before I model screens.",
    date: "Aug 2, 2025",
  },
  {
    title: "Building and Griefing happen the same days",
    description: "",
    date: "Sept 4, 2026",
  },
];

export function Notes() {
  return (
    <section
      id="notes"
      data-inverse
      className="px-[clamp(24px,4.5vw,64px)] pt-[clamp(40px,6.5vw,96px)] pb-[clamp(56px,8vw,128px)]"
      style={{ background: "var(--paper)", color: "var(--ink)" }}
    >
      <div className="mb-[clamp(40px,5vw,64px)] grid grid-cols-1 gap-x-6 gap-y-3 lg:grid-cols-12">
        <SectionLabel className="lg:col-span-2 lg:col-start-1">
          Notes
        </SectionLabel>
      </div>

      <div className="flex flex-col">
        {NOTES.map((note) => (
          <a
            key={note.title}
            href="#notes"
            className="grid grid-cols-1 items-baseline gap-x-6 gap-y-2 border-t py-6 transition-colors duration-300 hover:bg-[var(--wash)] lg:grid-cols-12"
            style={{ borderColor: "var(--rule)" }}
          >
            <span className="text-[11px] lg:col-start-1 lg:col-span-1" style={{ color: "var(--accent)" }}>
              —
            </span>
            <span className="text-[clamp(20px,1.9vw,26px)] leading-[1.25] font-normal lg:col-start-2 lg:col-span-6">
              {note.title}
            </span>
            <span
              className="text-[15px] leading-[1.55] text-pretty lg:col-start-8 lg:col-span-4"
              style={{ color: "var(--muted)" }}
            >
              {note.description}
            </span>
            <span className="text-[11px] lg:col-start-12 lg:col-span-1 lg:text-right" style={{ color: "var(--faint)" }}>
              {note.date}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
