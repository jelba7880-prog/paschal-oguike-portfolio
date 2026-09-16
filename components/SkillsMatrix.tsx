"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/Card";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { GlassScrim } from "@/components/ui/GlassScrim";
import { SKILL_CATEGORIES, type Skill } from "@/lib/skills";

function SkillCell({ skill }: { skill: Skill }) {
  return (
    <div className="flex flex-col items-center gap-2.5 p-[14px_6px] text-center">
      {/* Empty dock slot: CursorField portals the one and only copy of this
          icon in here once it flies home, so nothing is rendered inside it by
          default — see components/CursorField.tsx. The img below is purely the
          no-field fallback and stays display:none unless the media queries that
          also switch the field off match (see .skill-slot-fallback). */}
      <div
        id={`skill-slot-${skill.id}`}
        className="skill-chase flex h-[34px] w-[34px] items-center justify-center"
      >
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

/** Below `sm` the categories are a swipeable strip (see the container class
 * below); these drive it on its own. Desktop is a plain grid and none of this
 * runs there. */
const MOBILE_STRIP_QUERY = "(max-width: 639px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
/** Dwell on each category before sliding to the next. */
const AUTO_SCROLL_MS = 3800;
/** After a real swipe, how long to leave the strip alone before resuming. */
const RESUME_AFTER_INPUT_MS = 6000;
/** Fraction of a card's distance-from-centre the icons lag behind by, and the
 * cap on that lag. Small on purpose: the icons should trail their card as it
 * slides and settle once it lands, not fly across it. */
const CHASE_FACTOR = 0.22;
const CHASE_MAX_PX = 44;

/**
 * Auto-advances the mobile strip and, as it moves, offsets each card's icons
 * from their cells by how far that card sits from the centre. The CSS
 * transition on .skill-chase makes them ease back as the card lands, so they
 * read as chasing their slots rather than being glued to them — the mobile
 * stand-in for the cursor field, which never runs on touch devices (see
 * components/CursorField.tsx).
 */
function useMobileStrip(stripRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    const mobile = window.matchMedia(MOBILE_STRIP_QUERY);
    const reduced = window.matchMedia(REDUCED_MOTION_QUERY);

    let timer: ReturnType<typeof setInterval> | null = null;
    let observer: IntersectionObserver | null = null;
    let pausedUntil = 0;
    let visible = false;

    function pageWidth() {
      const first = strip!.firstElementChild as HTMLElement | null;
      // Card width plus the flex gap, so one step lands exactly on the next
      // snap point rather than drifting by the gap each time.
      return first ? first.getBoundingClientRect().width + 18 : strip!.clientWidth;
    }

    function updateChase() {
      const mid = strip!.scrollLeft + strip!.clientWidth / 2;
      for (const card of Array.from(strip!.children) as HTMLElement[]) {
        const centre = card.offsetLeft + card.offsetWidth / 2;
        const lag = Math.max(-CHASE_MAX_PX, Math.min(CHASE_MAX_PX, (centre - mid) * CHASE_FACTOR));
        card.style.setProperty("--chase", `${lag.toFixed(1)}px`);
      }
    }

    function clearChase() {
      for (const card of Array.from(strip!.children) as HTMLElement[]) {
        card.style.removeProperty("--chase");
      }
    }

    function advance() {
      if (!visible || performance.now() < pausedUntil) return;
      const step = pageWidth();
      const index = Math.round(strip!.scrollLeft / step);
      const next = index + 1 >= strip!.children.length ? 0 : index + 1;
      strip!.scrollTo({ left: next * step, behavior: "smooth" });
    }

    function pause() {
      pausedUntil = performance.now() + RESUME_AFTER_INPUT_MS;
    }

    function start() {
      if (timer) return;
      // Only animates while the section is actually on screen — no point
      // sliding a strip nobody is looking at.
      observer = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
        },
        { threshold: 0.25 },
      );
      observer.observe(strip!);
      updateChase();
      strip!.addEventListener("scroll", updateChase, { passive: true });
      strip!.addEventListener("touchstart", pause, { passive: true });
      strip!.addEventListener("pointerdown", pause, { passive: true });
      timer = setInterval(advance, AUTO_SCROLL_MS);
    }

    function stop() {
      observer?.disconnect();
      observer = null;
      strip!.removeEventListener("scroll", updateChase);
      strip!.removeEventListener("touchstart", pause);
      strip!.removeEventListener("pointerdown", pause);
      if (timer) clearInterval(timer);
      timer = null;
      clearChase();
    }

    // Re-evaluated on every breakpoint / motion-preference change, not just at
    // mount: crossing into the grid layout (rotating a phone, resizing) has to
    // stop the strip driving itself, and crossing back has to start it again.
    function sync() {
      if (mobile.matches && !reduced.matches) start();
      else stop();
    }

    sync();
    mobile.addEventListener("change", sync);
    reduced.addEventListener("change", sync);

    return () => {
      mobile.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
      stop();
    };
  }, [stripRef]);
}

export function SkillsMatrix() {
  const stripRef = useRef<HTMLDivElement>(null);
  useMobileStrip(stripRef);

  return (
    <section
      id="stack"
      className="px-[clamp(24px,4.5vw,64px)] pt-[clamp(56px,6vw,88px)] pb-[clamp(64px,9.5vw,136px)]"
    >
      <div className="mb-[clamp(40px,5vw,64px)] grid grid-cols-1 gap-x-6 gap-y-3 lg:grid-cols-12">
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

      {/* No z-[21] here, unlike Projects' GlassScrim usage: that section has
          no reason for CursorField to render above its cards,
          but this grid is exactly what the floating field flies into and
          docks onto — it must stay visible above the field the whole time,
          not hidden behind glass, so this section is deliberately left at
          the default stack order (below CursorField's z-20). */}
      <div className="relative p-[18px]">
        <GlassScrim />
        {/* One container, not a mobile copy beside a desktop copy: every
            skill renders exactly one `skill-slot-{id}` element, and a second
            hidden copy would give CursorField a duplicate id to dock into.
            Below `sm` this is a full-width scroll-snap strip, one category
            per swipe; from `sm` up the flex/snap utilities are overridden by
            the grid ones and each wrapper turns into `display: contents`, so
            the Cards remain direct grid children and stretch exactly as they
            did before. */}
        <div
          ref={stripRef}
          className="relative flex snap-x snap-mandatory gap-[18px] overflow-x-auto pb-2 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-x-visible sm:pb-0 xl:grid-cols-3"
        >
          {SKILL_CATEGORIES.map((category) => (
            <div key={category.title} className="w-full shrink-0 snap-center sm:contents">
              <Card>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
