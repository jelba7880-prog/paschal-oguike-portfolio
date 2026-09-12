import { Badge } from "@/components/ui/Badge";
import { FlipWord } from "@/components/FlipWord";

const HANDLES = [
  "Money",
  "Inventory",
  "Operations",
  "Internal Admin Tools",
  "Customer Support",
  "Internal Analytics",
  "Billing & Invoicing",
  "Vendor & Supply Portals",
  "Messaging Pipelines",
];

const HANDLE_COLORS = [
  "var(--flip-1)",
  "var(--flip-2)",
  "var(--flip-3)",
  "var(--flip-4)",
  "var(--flip-5)",
  "var(--flip-6)",
  "var(--flip-7)",
  "var(--flip-8)",
  "var(--flip-9)",
];

export function Hero() {
  return (
    <section
      id="top"
      className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-0 px-[clamp(24px,4.5vw,64px)] pt-[clamp(64px,10vw,128px)] pb-[clamp(64px,9.5vw,136px)]"
    >
      {/* Heading column: on desktop this is the right-hand block (photo takes
          the left), starting at the top row and running tall enough to sit
          alongside the photo below — the photo starts a row later (see its
          own lg:row-start-2 below) so the two columns don't align into an
          even, symmetrical pair; the text leads, the photo trails and lands
          lower, which is the asymmetry this layout is going for. */}
      <div className="flex flex-col gap-y-7 lg:col-start-7 lg:col-span-6 lg:row-start-1 lg:row-span-2 lg:self-start">
        <Badge href="#work" dot size="md" className="w-fit">
          Currently building — PZ Autos
        </Badge>

        <h1 className="font-display m-0 text-[clamp(34px,4.6vw,72px)] leading-[1.08] font-light tracking-[-0.015em] text-balance">
          I build web applications that handle <FlipWord words={HANDLES} colors={HANDLE_COLORS} /> — end to end.
        </h1>

        <p
          className="text-[clamp(17px,1.4vw,20px)] leading-[1.6] text-pretty max-w-[46ch]"
          style={{ color: "var(--body)" }}
        >
          I&apos;m a full-stack developer working across React, TypeScript, Node, and Postgres — end to end, from
          data model to UI. I like systems with real constraints: money that has to reconcile, inventory that has
          to stay accurate, forms that have to survive a non-technical user. Most of what&apos;s here came out of
          solving an actual operational problem for a business, not a tutorial.
        </p>
      </div>

      {/* Photo column: left side on desktop, starting one row down from the
          heading block for the offset/asymmetric composition described
          above. Wider than the old 4-col version (5 of 12) since it's now
          the left column's sole visual anchor rather than a small aside
          squeezed under the section label. */}
      <div className="lg:col-start-1 lg:col-span-5 lg:row-start-2 lg:mt-[clamp(28px,4vw,64px)]">
        <div className="aspect-[4/5] w-full" style={{ background: "var(--wash)" }} aria-hidden />
        <div className="mt-2.5 text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--faint)" }}>
          PO / 2026
        </div>
      </div>
    </section>
  );
}
