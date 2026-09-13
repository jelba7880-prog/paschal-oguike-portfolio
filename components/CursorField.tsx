"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  LayoutGroup,
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "framer-motion";

export interface CursorFieldItem {
  id: string;
  /** Icon source (e.g. a simpleicons.org URL). */
  src: string;
  size: number;
  /** 0 (far, dimmest when idle) .. 1 (near, brightest). */
  depth: number;
  /** Resting float position as a fraction of the viewport, 0-1. */
  x: number;
  y: number;
  /** True for icons that are a single dark color and need inverting in dark mode. */
  mono?: boolean;
}

/**
 * idle    — pointer hasn't entered the page yet, or has left it: icons rest at
 *           their own spots and wobble.
 * swarm   — pointer is on the page but outside the skills section: icons cluster
 *           loosely around it.
 * docked  — pointer is inside the skills section: every icon flies home to its
 *           slot in the grid.
 * resting — the page has scrolled to the Notes section or beyond: the swarm
 *           mechanic is suspended entirely (no cursor-following, no docking)
 *           so it never covers the notes' text or clutters the footer — icons
 *           just sit still, dim, at their spread-out resting spots, fading to
 *           fully invisible by the time the footer arrives.
 */
type FieldMode = "idle" | "swarm" | "docked" | "resting";

/** Deliberately sluggish — icons should read as trailing the cursor, not
 *  locked to it. Per-icon variance (see FOLLOW_SPEED_RANGE below) is layered
 *  on top of this base so the flock doesn't move as one rigid unit. */
const FLOAT_SPRING = { stiffness: 45, damping: 22, mass: 1.1 };
/** Multiplier range applied to FLOAT_SPRING.stiffness per icon (inversely to
 *  mass), so some icons lag noticeably more than others while all stay in
 *  the same "lazy" family. */
const FOLLOW_SPEED_RANGE: [number, number] = [0.55, 1.45];
/** Runs on framer's own clock, so the flight home is never tied to pointer or scroll speed.
 *  Overdamped on purpose — no bounce, a slow deliberate glide rather than a snap. */
const DOCK_TRANSITION = { type: "spring", stiffness: 110, damping: 26, mass: 1 } as const;
const DOCKED_SIZE = 24;
/** How long the pointer must consistently sit on one side of the boundary
 * before mode actually switches — filters out the flicker that real mouse
 * movement (and scrolling the section past a stationary cursor) produces
 * right at the edge, which otherwise restarts the dock/undock animation
 * mid-flight over and over. */
const MODE_DEBOUNCE_MS = 140;
/** Once docked, the cursor has to clear the section by this many px before
 * it's considered "left" — a plain edge-touch no longer flips it back out. */
const UNDOCK_MARGIN = 32;
/** Fraction of viewport height the Notes section's top must cross to enter/
 * leave the "resting" quiet zone — two different thresholds, same hysteresis
 * idea as UNDOCK_MARGIN, so scrolling back and forth right at the edge of
 * Notes doesn't flicker the swarm mechanic on and off. */
const QUIET_ZONE_ENTER = 0.8;
const QUIET_ZONE_EXIT = 0.95;
/** Extra margin (px) added on top of the footer's own height when computing
 * where its fade-to-zero completes — see the frame loop below for why this
 * has to be measured against the footer's actual height, not a fixed
 * viewport-height fraction: the footer is the last element on the page, so
 * its top can never scroll past (viewport height − footer height), and a
 * fixed fraction lower than that would mean the fade never reaches 0. */
const FOOTER_FADE_END_MARGIN = 24;

/** Stable pseudo-random 0..1 from an id, so per-icon variance survives re-renders and SSR. */
function hash01(seed: string, salt: number) {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

/**
 * One icon. It is the ONLY copy of itself on the page — when docked it is
 * portalled into its grid slot (an empty placeholder rendered by
 * SkillsMatrix), and otherwise it lives in the fixed field layer. Both
 * renders share a layoutId, so framer's shared-layout engine morphs position
 * and size between them instead of anything here measuring rects per frame.
 */
function FieldIcon({
  item,
  mode,
  pointerX,
  pointerY,
  restOpacity,
}: {
  item: CursorFieldItem;
  mode: FieldMode;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  /** 1 while resting icons should show at their (already dim) rest opacity,
   * easing to 0 as the footer approaches — see CursorField's frame loop. */
  restOpacity: MotionValue<number>;
}) {
  const wobbleSeconds = useMemo(() => 4 + hash01(item.id, 3) * 3, [item.id]);
  // Genuinely randomized (Math.random, not a deterministic hash) and re-rolled
  // rarely while swarming, so icons don't settle into one fixed spot relative
  // to the cursor — each one drifts to a new random offset every several
  // seconds instead of holding a rigid, always-identical formation. Picking a
  // new target and actually arriving there are deliberately decoupled from the
  // fast cursor-tracking spring below: x/current drifts toward targetX/Y on
  // its own slow multi-second ease, so 27 icons independently rerolling every
  // 5-9s doesn't read as constant flurry, and each individual drift is a
  // gentle glide rather than a snap. rerollAt starts negative as a sentinel:
  // Math.random() can't run here (it'd run on every render, which React's
  // purity rule flags), so the very first roll happens lazily below instead.
  const cluster = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, rerollAt: -1, lastT: -1 });

  // Stable per-icon speed multiplier so each icon trails the cursor at its
  // own lazy pace instead of the whole flock moving in lockstep.
  const followSpring = useMemo(() => {
    const [min, max] = FOLLOW_SPEED_RANGE;
    const speed = min + hash01(item.id, 7) * (max - min);
    return { stiffness: FLOAT_SPRING.stiffness * speed, damping: FLOAT_SPRING.damping, mass: FLOAT_SPRING.mass / speed };
  }, [item.id]);
  const x = useSpring(0, followSpring);
  const y = useSpring(0, followSpring);
  // Its own spring rather than a plain per-render ternary, because "resting"
  // opacity also depends on restOpacity — a continuously-changing value tied
  // to scroll, not a discrete mode switch — so it needs a per-frame target,
  // not a one-shot `animate` prop.
  const opacity = useSpring(0.22 + item.depth * 0.5, { stiffness: 120, damping: 24 });
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // The slot is rendered by SkillsMatrix, so it can only be looked up once
    // both components have mounted — hence state rather than a ref callback.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSlot(document.getElementById(`skill-slot-${item.id}`));
  }, [item.id]);

  // Kept running even while docked, so the float position stays current and an
  // icon leaving its slot heads somewhere sensible rather than snapping back to
  // wherever it happened to be when it docked.
  useAnimationFrame((t) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (mode === "docked") {
      opacity.set(1);
    } else if (mode === "resting") {
      opacity.set((0.1 + item.depth * 0.12) * restOpacity.get());
    } else if (mode === "swarm") {
      // Dim relative to how it used to be (was 0.55-0.90 — vivid enough to
      // compete with any text it swarmed over). This only matters outside
      // the skills grid, where there's no GlassScrim to blur it down for
      // free, so it needs to sit dim on its own: visible enough to read as
      // "alive," but never so opaque it fights with page copy underneath it.
      opacity.set(0.25 + item.depth * 0.2);
    } else {
      opacity.set(0.22 + item.depth * 0.5);
    }

    if (mode === "swarm") {
      const c = cluster.current;
      if (c.rerollAt < 0) {
        // First frame of this swarm session: start exactly at the target so
        // the icon doesn't drift in from (0, 0) relative to the cursor.
        c.targetX = (Math.random() - 0.5) * 320;
        c.targetY = (Math.random() - 0.5) * 260;
        c.x = c.targetX;
        c.y = c.targetY;
        c.rerollAt = t + 5000 + Math.random() * 4000;
        c.lastT = t;
      } else if (t >= c.rerollAt) {
        c.targetX = (Math.random() - 0.5) * 320;
        c.targetY = (Math.random() - 0.5) * 260;
        c.rerollAt = t + 5000 + Math.random() * 4000;
      }
      // Slow, independent glide toward the current target — a ~1.4s time
      // constant regardless of how responsive FLOAT_SPRING is to the cursor,
      // so this is the "very slow, gentle drift" and cursor-following stays
      // exactly as snappy as it already was.
      const dt = Math.min(Math.max(t - c.lastT, 0), 100) / 1000;
      c.lastT = t;
      const ease = 1 - Math.exp(-dt / 1.4);
      c.x += (c.targetX - c.x) * ease;
      c.y += (c.targetY - c.y) * ease;

      x.set(pointerX.get() + c.x);
      y.set(pointerY.get() + c.y);
    } else {
      // Reset so the next swarm session starts its own fresh reroll timer
      // instead of comparing against a stale future timestamp.
      cluster.current.rerollAt = -1;
      x.set(item.x * vw - vw / 2);
      y.set(item.y * vh - vh / 2);
    }
  });

  const docked = mode === "docked" && slot !== null;
  const still = docked || mode === "resting"; // no wobble — settled in the grid, or deliberately static while resting

  // layoutId lives here and nothing else animates this element's transform —
  // framer's layout projection owns it. The wobble sits on the child img
  // because rotate and layout projection can't share an element.
  const icon = (
    <motion.div
      layoutId={`swarm-${item.id}`}
      aria-hidden
      transition={{ layout: DOCK_TRANSITION }}
      style={{
        width: docked ? DOCKED_SIZE : item.size,
        height: docked ? DOCKED_SIZE : item.size,
        opacity,
      }}
    >
      <motion.img
        src={item.src}
        alt=""
        draggable={false}
        data-mono={item.mono ? "" : undefined}
        animate={still ? { rotate: 0 } : { rotate: [0, 10, -10, 0] }}
        transition={
          still ? { duration: 0.4 } : { duration: wobbleSeconds, repeat: Infinity, ease: "easeInOut" }
        }
        style={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }}
      />
    </motion.div>
  );

  if (docked) return createPortal(icon, slot);

  return (
    <motion.div
      style={{
        position: "fixed",
        left: "50%",
        top: "50%",
        marginLeft: -item.size / 2,
        marginTop: -item.size / 2,
        x,
        y,
      }}
    >
      {icon}
    </motion.div>
  );
}

/**
 * Persistent field layer, mounted once at the root layout so it spans every
 * section. Docking is driven purely by where the pointer is — when it enters
 * the skills section every icon flies home to its grid slot, and when it
 * leaves they all come back out. The one scroll-driven exception is the
 * "resting" quiet zone from Notes onward (see FieldMode), which overrides
 * pointer-driven behavior entirely so the swarm never covers that section's
 * text or clutters the footer.
 */
export function CursorField({ items = [] }: { items?: CursorFieldItem[] }) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const restOpacity = useMotionValue(1);
  const pointer = useRef({ x: 0, y: 0, onPage: false });
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<FieldMode>("idle");
  const modeRef = useRef<FieldMode>("idle");
  const pendingRef = useRef<{ mode: FieldMode; since: number }>({ mode: "idle", since: 0 });
  const quietZoneRef = useRef(false);

  useEffect(() => {
    if (items.length === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    // No field for these visitors; the grid slots reveal their own static icons
    // via CSS instead (see .skill-slot-fallback in app/globals.css).
    if (reduced || coarsePointer) return;

    // matchMedia is only available client-side, so whether the field renders
    // at all can only be decided once mounted, not during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);

    function handlePointerMove(e: PointerEvent) {
      pointer.current = { x: e.clientX, y: e.clientY, onPage: true };
      pointerX.set(e.clientX - window.innerWidth / 2);
      pointerY.set(e.clientY - window.innerHeight / 2);
    }

    function handlePointerOut(e: PointerEvent) {
      if (!e.relatedTarget) pointer.current.onPage = false;
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerout", handlePointerOut, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerout", handlePointerOut);
    };
  }, [items, pointerX, pointerY]);

  useAnimationFrame((t) => {
    if (!enabled) return;
    const vh = window.innerHeight;
    const notes = document.getElementById("notes");

    // Once the page has scrolled to Notes or beyond, the swarm mechanic is
    // suspended outright — regardless of pointer position — so it can never
    // cover the notes' text or clutter the footer. Hysteresis (two different
    // thresholds) keeps scrolling back and forth right at that edge from
    // flickering the whole mechanic on and off.
    const quietZone = notes
      ? quietZoneRef.current
        ? notes.getBoundingClientRect().top < vh * QUIET_ZONE_EXIT
        : notes.getBoundingClientRect().top < vh * QUIET_ZONE_ENTER
      : quietZoneRef.current;
    quietZoneRef.current = quietZone;

    let next: FieldMode;
    if (quietZone) {
      next = "resting";
    } else {
      const hero = document.getElementById("top");
      const section = document.getElementById("stack");
      const { x, y, onPage } = pointer.current;
      next = "idle";
      const heroRect = hero?.getBoundingClientRect();
      const inHero = !!heroRect && x >= heroRect.left && x <= heroRect.right && y >= heroRect.top && y <= heroRect.bottom;
      // The hero section is a no-swarm zone: the field stays idle there even
      // while the pointer is on the page, so it never trails the cursor over
      // the intro copy/portrait. Leaving hero (in any direction) re-arms
      // normal swarm/dock behavior immediately.
      if (section && onPage && !inHero) {
        const r = section.getBoundingClientRect();
        // Hysteresis: once docked, the cursor must clear the section by
        // UNDOCK_MARGIN before it counts as "left" — a bare edge-touch no
        // longer flips it back out.
        const margin = modeRef.current === "docked" ? UNDOCK_MARGIN : 0;
        const inside =
          x >= r.left - margin && x <= r.right + margin && y >= r.top - margin && y <= r.bottom + margin;
        next = inside ? "docked" : "swarm";
      }
    }

    // Debounce: only commit a mode change once it's held steady for
    // MODE_DEBOUNCE_MS, so momentary flicker right at a boundary (real mouse
    // movement, or scrolling a section past a stationary cursor) can't
    // restart an in-flight animation over and over.
    if (next !== pendingRef.current.mode) {
      pendingRef.current = { mode: next, since: t };
    } else if (next !== modeRef.current && t - pendingRef.current.since >= MODE_DEBOUNCE_MS) {
      modeRef.current = next;
      setMode(next);
    }

    // Independent of the mode debounce above: fades resting icons the rest of
    // the way to fully invisible as the footer approaches, so "no icons at
    // all in the footer" holds regardless of exactly when "resting" commits.
    // Measured against the footer's own height (see FOOTER_FADE_END_MARGIN) —
    // it's the last element on the page, so its top can never scroll past
    // (vh − its height), which a fixed viewport-height fraction can't account
    // for on a short footer or a short viewport.
    const footer = document.getElementById("site-footer");
    if (footer) {
      const footerRect = footer.getBoundingClientRect();
      const fadeStart = vh;
      const fadeEnd = vh - footerRect.height + FOOTER_FADE_END_MARGIN;
      const fade = Math.min(1, Math.max(0, (footerRect.top - fadeEnd) / (fadeStart - fadeEnd)));
      restOpacity.set(fade);
    }
  });

  if (!enabled || items.length === 0) return null;

  return (
    <LayoutGroup>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
        {items.map((item) => (
          <FieldIcon
            key={item.id}
            item={item}
            mode={mode}
            pointerX={pointerX}
            pointerY={pointerY}
            restOpacity={restOpacity}
          />
        ))}
      </div>
    </LayoutGroup>
  );
}
