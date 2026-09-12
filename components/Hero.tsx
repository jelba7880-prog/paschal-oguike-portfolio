import { Badge } from "@/components/ui/Badge";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function Hero() {
  return (
    <section
      id="top"
      className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-0 px-[clamp(24px,4.5vw,64px)] pt-[clamp(64px,10vw,128px)] pb-[clamp(64px,9.5vw,136px)]"
    >
      <div className="lg:col-span-2 lg:col-start-1 lg:pt-[14px]">
        <SectionLabel number="01">Positioning</SectionLabel>
      </div>

      <Badge
        href="#work"
        dot
        size="md"
        className="w-fit lg:col-start-3 lg:col-span-10 lg:mb-[clamp(28px,3vw,44px)]"
      >
        Currently building — PZ Autos
      </Badge>

      <h1 className="font-display m-0 text-[clamp(44px,6.4vw,96px)] leading-[1.04] font-light tracking-[-0.015em] text-balance lg:col-start-3 lg:col-span-10">
        I architect the system.
        <br />
        <em className="font-normal italic">The agents type the code.</em>
      </h1>

      <div className="lg:col-start-1 lg:col-span-4 lg:mt-[clamp(32px,4vw,56px)]">
        <div className="aspect-[4/5] w-full" style={{ background: "var(--wash)" }} aria-hidden />
        <div className="mt-2.5 text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--faint)" }}>
          PO / 2026
        </div>
      </div>

      <p
        className="text-[clamp(18px,1.6vw,22px)] leading-[1.55] text-pretty lg:col-start-6 lg:col-span-6 lg:mt-[clamp(32px,4vw,56px)]"
        style={{ color: "var(--body)" }}
      >
        I&apos;m a full-stack developer working across React, TypeScript, Node, and Postgres — end to end, from
        data model to UI. I like systems with real constraints: money that has to reconcile, inventory that has
        to stay accurate, forms that have to survive a non-technical user. Most of what&apos;s here came out of
        solving an actual operational problem for a business, not a tutorial.
      </p>
    </section>
  );
}
