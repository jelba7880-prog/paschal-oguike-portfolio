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
 * idle   — pointer hasn't entered the page yet, or has left it: icons rest at
 *          their own spots and wobble.
 * swarm  — pointer is on the page but outside the skills section: icons cluster
 *          loosely around it.
 * docked — pointer is inside the skills section: every icon flies home to its
 *          slot in the grid.
 */
type FieldMode = "idle" | "swarm" | "docked";

const FLOAT_SPRING = { stiffness: 90, damping: 20, mass: 0.8 };
/** Runs on framer's own clock, so the flight home is never tied to pointer or scroll speed. */
const DOCK_TRANSITION = { type: "spring", stiffness: 150, damping: 24, mass: 0.9 } as const;
const DOCKED_SIZE = 24;

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
}: {
  item: CursorFieldItem;
  mode: FieldMode;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}) {
  const variance = useMemo(
    () => ({
      clusterX: (hash01(item.id, 1) - 0.5) * 280,
      clusterY: (hash01(item.id, 2) - 0.5) * 220,
      wobbleSeconds: 4 + hash01(item.id, 3) * 3,
    }),
    [item.id],
  );

  const x = useSpring(0, FLOAT_SPRING);
  const y = useSpring(0, FLOAT_SPRING);
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
  useAnimationFrame(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (mode === "swarm") {
      x.set(pointerX.get() + variance.clusterX);
      y.set(pointerY.get() + variance.clusterY);
    } else {
      x.set(item.x * vw - vw / 2);
      y.set(item.y * vh - vh / 2);
    }
  });

  const docked = mode === "docked" && slot !== null;
  const opacity = docked ? 1 : mode === "swarm" ? 0.55 + item.depth * 0.35 : 0.22 + item.depth * 0.5;

  // layoutId lives here and nothing else animates this element's transform —
  // framer's layout projection owns it. The wobble sits on the child img
  // because rotate and layout projection can't share an element.
  const icon = (
    <motion.div
      layoutId={`swarm-${item.id}`}
      aria-hidden
      animate={{ opacity }}
      transition={{ layout: DOCK_TRANSITION, opacity: { duration: 0.35 } }}
      style={{
        width: docked ? DOCKED_SIZE : item.size,
        height: docked ? DOCKED_SIZE : item.size,
      }}
    >
      <motion.img
        src={item.src}
        alt=""
        draggable={false}
        data-mono={item.mono ? "" : undefined}
        animate={docked ? { rotate: 0 } : { rotate: [0, 10, -10, 0] }}
        transition={
          docked
            ? { duration: 0.4 }
            : { duration: variance.wobbleSeconds, repeat: Infinity, ease: "easeInOut" }
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
 * the skills section every icon flies into its grid slot, and when it leaves
 * they all come back out. Nothing here reads scroll position.
 */
export function CursorField({ items = [] }: { items?: CursorFieldItem[] }) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const pointer = useRef({ x: 0, y: 0, onPage: false });
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<FieldMode>("idle");
  const modeRef = useRef<FieldMode>("idle");

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

  useAnimationFrame(() => {
    if (!enabled) return;
    const section = document.getElementById("stack");
    if (!section) return;

    const { x, y, onPage } = pointer.current;
    let next: FieldMode = "idle";
    if (onPage) {
      const r = section.getBoundingClientRect();
      const inside = x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
      next = inside ? "docked" : "swarm";
    }

    if (next !== modeRef.current) {
      modeRef.current = next;
      setMode(next);
    }
  });

  if (!enabled || items.length === 0) return null;

  return (
    <LayoutGroup>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
        {items.map((item) => (
          <FieldIcon key={item.id} item={item} mode={mode} pointerX={pointerX} pointerY={pointerY} />
        ))}
      </div>
    </LayoutGroup>
  );
}
