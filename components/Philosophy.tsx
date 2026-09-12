import { SectionLabel } from "@/components/ui/SectionLabel";

interface Conviction {
  number: string;
  title: string;
  body: string;
}

const CONVICTIONS: Conviction[] = [
  {
    number: "01",
    title: "Find the real cause.",
    body: "If a bug shows up once, I check whether the same pattern is quietly breaking something else before I touch code — not just patch what's in front of me.",
  },
  {
    number: "02",
    title: "Design for the business, not the template.",
    body: "On Sterling Capital Exchange that meant getting settlement and currency handling right before adding anything on top of it. On Stonebridge and Polanco, it meant building around how the business actually runs day to day, not how a generic CRUD app assumes it should.",
  },
  {
    number: "03",
    title: "Simple first, robust when it's earned.",
    body: "I'd rather ship the maintainable version and harden it later than reach for a clever abstraction before the problem asks for it.",
  },
];

export function Philosophy() {
  return (
    <section
      id="process"
      className="px-[clamp(24px,4.5vw,64px)] pt-[clamp(28px,3.5vw,48px)] pb-[clamp(40px,5vw,72px)]"
      style={{ background: "var(--wash)" }}
    >
      <div
        className="mb-[clamp(48px,6vw,72px)] grid grid-cols-1 gap-x-6 gap-y-4 border-t pt-5 lg:grid-cols-12"
        style={{ borderColor: "var(--ink)" }}
      >
        <SectionLabel number="03" className="lg:col-span-2 lg:col-start-1">
          How I work
        </SectionLabel>
        <h2 className="font-display m-0 text-[clamp(30px,3.4vw,50px)] leading-[1.12] font-light tracking-[-0.01em] lg:col-start-3 lg:col-span-7">
          Three convictions the whole method rests on.
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-6">
        <p className="font-display text-[clamp(24px,2.4vw,34px)] leading-[1.3] font-light text-balance lg:col-start-1 lg:col-span-5">
          Typing was never the bottleneck. <em className="italic">Judgment is.</em> The work is deciding what to
          build, constraining how it&apos;s built, and refusing what isn&apos;t good enough.
        </p>

        <ol className="m-0 flex list-none flex-col p-0 lg:col-start-7 lg:col-span-6">
          {CONVICTIONS.map((conviction) => (
            <li
              key={conviction.number}
              className="grid grid-cols-[56px_1fr] gap-x-5 border-t py-[26px] last:border-b"
              style={{ borderColor: "var(--rule)" }}
            >
              <span className="pt-[7px] text-[12px]" style={{ color: "var(--accent)" }}>
                {conviction.number}
              </span>
              <div>
                <h3 className="font-display mt-0 mb-2.5 text-[22px] leading-[1.25] font-normal italic">
                  {conviction.title}
                </h3>
                <p className="m-0 text-[15px] leading-[1.6] text-pretty" style={{ color: "var(--body)" }}>
                  {conviction.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
