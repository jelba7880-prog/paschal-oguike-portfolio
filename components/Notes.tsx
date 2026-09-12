import { SectionLabel } from "@/components/ui/SectionLabel";

interface Note {
  number: string;
  title: string;
  description: string;
  meta: string;
  readTime: string;
}

const NOTES: Note[] = [
  {
    number: "01",
    title: "Specs are the new source code",
    description: "If an agent can't build it from the doc, the doc was never finished.",
    meta: "Aug 2026 · own site",
    readTime: "4 min",
  },
  {
    number: "02",
    title: "Row-level security is a design decision",
    description: "Why I model Supabase permissions before I model screens.",
    meta: "Jun 2026 · own site",
    readTime: "6 min",
  },
  {
    number: "03",
    title: "Reviewing code you didn't type",
    description: "The reading discipline that keeps generated work honest.",
    meta: "Apr 2026 · GitHub",
    readTime: "3 min",
  },
];

export function Notes() {
  return (
    <section
      id="notes"
      data-inverse
      className="px-[clamp(24px,4.5vw,64px)] pt-[clamp(28px,3.5vw,48px)] pb-[clamp(40px,5vw,72px)]"
      style={{ background: "var(--paper)", color: "var(--ink)" }}
    >
      <div
        className="mb-[clamp(40px,5vw,64px)] grid grid-cols-1 gap-x-6 gap-y-3 border-t pt-5 lg:grid-cols-12"
        style={{ borderColor: "var(--ink)" }}
      >
        <SectionLabel number="06" className="lg:col-span-2 lg:col-start-1">
          Notes
        </SectionLabel>
        <h2 className="font-display m-0 text-[clamp(30px,3.4vw,50px)] leading-[1.12] font-light tracking-[-0.01em] italic lg:col-start-3 lg:col-span-7">
          Written from inside the work.
        </h2>
      </div>

      <div className="flex flex-col">
        {NOTES.map((note) => (
          <a
            key={note.number}
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
            <span
              className="text-[11px] lg:col-start-12 lg:col-span-1 lg:text-right"
              style={{ color: "var(--muted)" }}
            >
              <span className="block" style={{ color: "var(--faint)" }}>
                {note.meta}
              </span>
              {note.readTime}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
