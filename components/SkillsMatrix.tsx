import { Card } from "@/components/ui/Card";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { GlassScrim } from "@/components/ui/GlassScrim";
import { SKILL_CATEGORIES, type Skill } from "@/lib/skills";

function SkillCell({ skill }: { skill: Skill }) {
  return (
    <div
      className="flex flex-col items-center gap-2.5 border p-[14px_6px] text-center"
      style={{ borderColor: "var(--rule)" }}
    >
      {/* Empty dock slot: CursorField portals the one and only copy of this
          icon in here once it flies home, so nothing is rendered inside it by
          default — see components/CursorField.tsx. The img below is purely the
          no-field fallback and stays display:none unless the media queries that
          also switch the field off match (see .skill-slot-fallback). */}
      <div id={`skill-slot-${skill.id}`} className="flex h-[34px] w-[34px] items-center justify-center">
        <img
          src={skill.src}
          alt={skill.label}
          data-mono={skill.mono ? "" : undefined}
          width={24}
          height={24}
          className="skill-slot-fallback h-6 w-6 object-contain"
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
    <section
      id="stack"
      className="px-[clamp(24px,4.5vw,64px)] pt-[clamp(56px,6vw,88px)] pb-[clamp(64px,9.5vw,136px)]"
    >
      <div
        className="mb-[clamp(40px,5vw,64px)] grid grid-cols-1 gap-x-6 gap-y-3 border-t pt-8 lg:grid-cols-12"
        style={{ borderColor: "var(--ink)" }}
      >
        <SectionLabel className="lg:col-span-2 lg:col-start-1">
          Technical skills
        </SectionLabel>
        <p
          className="text-[16px] leading-[1.6] text-pretty lg:col-start-10 lg:col-span-3 lg:self-end"
          style={{ color: "var(--muted)" }}
        >
          The stack, roughly.
        </p>
      </div>

      {/* No z-[21] here, unlike Projects/TrackRecord's GlassScrim usage: those
          sections have no reason for CursorField to render above their cards,
          but this grid is exactly what the floating field flies into and
          docks onto — it must stay visible above the field the whole time,
          not hidden behind glass, so this section is deliberately left at
          the default stack order (below CursorField's z-20). */}
      <div className="relative p-[18px]">
        <GlassScrim />
        <div className="relative grid grid-cols-1 gap-[18px] sm:grid-cols-2 xl:grid-cols-3">
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
      </div>
    </section>
  );
}
