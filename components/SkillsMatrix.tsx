import { Card } from "@/components/ui/Card";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SKILL_CATEGORIES, type Skill } from "@/lib/skills";

function SkillCell({ skill }: { skill: Skill }) {
  return (
    <div
      className="flex flex-col items-center gap-2.5 border p-[14px_6px] text-center"
      style={{ borderColor: "var(--rule)" }}
    >
      {/* Dock slot for the matching CursorField item — see components/CursorField.tsx.
          CursorField flips this element's data-docked attribute the moment its
          floating icon arrives; the img below stays hidden until then. */}
      <div
        id={`skill-slot-${skill.id}`}
        data-docked="false"
        className="group flex h-[34px] w-[34px] items-center justify-center"
      >
        <img
          src={skill.src}
          alt={skill.label}
          data-mono={skill.mono ? "" : undefined}
          width={24}
          height={24}
          className="h-6 w-6 object-contain opacity-0 transition-opacity duration-500 group-data-[docked=true]:opacity-100"
        />
      </div>
      <span className="text-[9px] uppercase tracking-[0.08em]" style={{ color: "var(--muted)" }}>
        {skill.label}
      </span>
    </div>
  );
}

export function SkillsMatrix() {
  return (
    <section id="stack" className="px-[clamp(24px,4.5vw,64px)] pb-[clamp(64px,9.5vw,136px)]">
      <div
        className="mb-[clamp(40px,5vw,64px)] grid grid-cols-1 gap-x-6 gap-y-3 border-t pt-5 lg:grid-cols-12"
        style={{ borderColor: "var(--ink)" }}
      >
        <SectionLabel number="04" className="lg:col-span-2 lg:col-start-1">
          Technical skills
        </SectionLabel>
        <p
          className="text-[16px] leading-[1.6] text-pretty lg:col-start-10 lg:col-span-3 lg:self-end"
          style={{ color: "var(--muted)" }}
        >
          A bunch of things I know
        </p>
      </div>

      <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 xl:grid-cols-3">
        {SKILL_CATEGORIES.map((category) => (
          <Card key={category.title}>
            <div
              className="border-b pb-3.5 text-[10px] uppercase tracking-[0.18em]"
              style={{ borderColor: "var(--rule)", color: "var(--accent)" }}
            >
              {category.title}
            </div>
            <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(76px,1fr))] gap-2.5">
              {category.items.map((skill) => (
                <SkillCell key={skill.id} skill={skill} />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
