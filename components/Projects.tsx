"use client";

import { Suspense, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MotionConfig, motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { GlassScrim } from "@/components/ui/GlassScrim";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ProjectModal } from "@/components/ProjectModal";
import { PROJECTS, type Project } from "@/lib/projects-data";

/** Tailwind's `xl` — the point where the grid is already a single 4-up row,
 * which is exactly the layout the deck spreads out into. */
const DECK_MEDIA_QUERY = "(min-width: 80rem)";
/** Same overdamped feel as CursorField's dock flight, a touch quicker since
 * the distances here are a card width rather than the whole viewport. */
const DECK_TRANSITION = { type: "spring", stiffness: 140, damping: 24, mass: 1 } as const;
/** Each card's horizontal offset from its own grid slot toward the deck's
 * center, as a percentage of one card width. -100 would stack them exactly;
 * the remaining 60% is the strip of every card behind that stays uncovered —
 * wide enough for its index, tech icon, and most of its title's first line. */
const FAN_X_STEP = -40;
/** Drop (px) per squared step from the center, so the outer cards sit a
 * little lower and the row reads as a held hand rather than a flat strip. */
const FAN_ARC = 6;
const FAN_ROTATE_STEP = 2;
/** Room under the row for the arc plus the rotated cards' lower corners. */
const FAN_RESERVE = 28;
const FAN_SHADOW = "0px 22px 44px -26px rgba(23,19,16,0.5)";
const NO_SHADOW = "0px 0px 0px 0px rgba(23,19,16,0)";

/**
 * Reads the ?project= query param and resolves the open modal from it.
 * Isolated behind Suspense because useSearchParams forces client-side
 * rendering up to the nearest Suspense boundary during static prerendering
 * — without this, `next build` fails for this otherwise-static page.
 */
function ProjectModalGate() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const openProjectId = searchParams.get("project");
  const openProject = PROJECTS.find((project) => project.id === openProjectId) ?? null;

  function close() {
    router.push(pathname, { scroll: false });
  }

  return <ProjectModal project={openProject} onClose={close} />;
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen?: () => void }) {
  const icon = project.techIcons[0];

  return (
    <Card interactive={Boolean(onOpen)} onClick={onOpen} className="h-full">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2.5">
          <span className="text-[11px]" style={{ color: "var(--accent)" }}>
            {project.number}
          </span>
          {icon && (
            <img
              src={icon.src}
              alt={icon.label}
              title={icon.label}
              data-mono={icon.mono ? "" : undefined}
              width={14}
              height={14}
              className="block"
            />
          )}
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
  );
}

export function Projects() {
  const router = useRouter();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [deckOpen, setDeckOpen] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(DECK_MEDIA_QUERY);
    // matchMedia is only available client-side, so whether the deck fans at
    // all can only be decided once mounted — same pattern as CursorField.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDesktop(query.matches);

    function handleChange(e: MediaQueryListEvent) {
      setIsDesktop(e.matches);
    }

    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  // Below the breakpoint there is no deck: every card is simply spread.
  const fanned = isDesktop && !deckOpen;

  function openProject(id: string) {
    router.push(`?project=${encodeURIComponent(id)}`, { scroll: false });
  }

  function handleDeckKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    // ProjectModal closes itself on Escape too, and focus is still on the card
    // that opened it — don't let that same keypress also restack the deck.
    if (e.key !== "Escape" || !deckOpen || new URLSearchParams(window.location.search).has("project")) return;
    setDeckOpen(false);
    toggleRef.current?.focus();
  }

  return (
    <section
      id="work"
      className="px-[clamp(24px,4.5vw,64px)] pt-[clamp(56px,6vw,88px)] pb-[clamp(56px,6vw,88px)]"
    >
      <div
        className="mb-[clamp(40px,5vw,64px)] grid grid-cols-1 gap-x-6 gap-y-3 border-t pt-8 lg:grid-cols-12"
        style={{ borderColor: "var(--ink)" }}
      >
        <SectionLabel className="lg:col-span-2 lg:col-start-1">
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
          Click any card to see the technical detail: the problem, the decisions, the parts that broke.
        </p>
      </div>

      {isDesktop && (
        <div className="mb-3.5 flex justify-end">
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setDeckOpen((open) => !open)}
            aria-expanded={deckOpen}
            aria-controls="work-deck"
            className="inline-flex items-center border px-3.5 py-[7px] text-[11px] font-medium uppercase tracking-[0.12em] whitespace-nowrap transition-colors duration-300 hover:border-[var(--ink)] hover:bg-[var(--wash)] hover:text-[var(--ink)]"
            style={{ borderColor: "var(--chip)", color: "var(--body)" }}
          >
            {deckOpen ? "Stack cards" : "Spread cards"}
          </button>
        </div>
      )}

      <div className="relative z-[21] p-[18px]">
        <GlassScrim />
        <MotionConfig reducedMotion="user" transition={DECK_TRANSITION}>
          {/* Keyed by breakpoint with initial={false}: crossing it (or the
              first client render after hydration) snaps straight to the right
              layout instead of playing the fan animation. Only an explicit
              open/close animates. */}
          <motion.div
            key={isDesktop ? "deck" : "grid"}
            id="work-deck"
            initial={false}
            animate={{ paddingBottom: fanned ? FAN_RESERVE : 0 }}
            // While fanned the whole deck is one "spread" target; once spread,
            // clicks belong to the individual cards and closing is explicit.
            onClick={fanned ? () => setDeckOpen(true) : undefined}
            onKeyDown={isDesktop ? handleDeckKeyDown : undefined}
            className={`relative grid grid-cols-1 gap-[18px] sm:grid-cols-2 xl:grid-cols-4 ${
              fanned ? "cursor-pointer" : ""
            }`}
          >
            {PROJECTS.map((project, i) => {
              const fromCenter = i - (PROJECTS.length - 1) / 2;
              return (
                <motion.div
                  key={project.id}
                  initial={false}
                  animate={
                    fanned
                      ? {
                          x: `${fromCenter * FAN_X_STEP}%`,
                          y: fromCenter * fromCenter * FAN_ARC,
                          rotate: fromCenter * FAN_ROTATE_STEP,
                          boxShadow: FAN_SHADOW,
                        }
                      : { x: "0%", y: 0, rotate: 0, boxShadow: NO_SHADOW }
                  }
                  // Stacked cards are only part of the deck, never their own
                  // target: unfocusable, and clicks fall through to the deck.
                  inert={fanned}
                  className={`relative ${fanned ? "pointer-events-none" : ""}`}
                  style={{ zIndex: i }}
                >
                  <ProjectCard project={project} onOpen={fanned ? undefined : () => openProject(project.id)} />
                </motion.div>
              );
            })}
          </motion.div>
        </MotionConfig>
      </div>

      <Suspense fallback={null}>
        <ProjectModalGate />
      </Suspense>
    </section>
  );
}
