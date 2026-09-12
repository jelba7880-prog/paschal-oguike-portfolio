"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue, useSpring, type MotionValue } from "framer-motion";

export interface CursorFieldItem {
  id: string;
  /** Icon source (e.g. a simpleicons.org URL). */
  src: string;
  size: number;
  /** 0 (far, barely reacts to the cursor) .. 1 (near, reacts most). */
  depth: number;
  /** Initial floating position as a fraction of the viewport, 0-1. */
  x: number;
  y: number;
  /** True for icons that are a single dark color and need inverting in dark mode. */
  mono?: boolean;
}

const SPRING = { stiffness: 140, damping: 22, mass: 0.6 };

/**
 * An item floats freely (reacting to the pointer, scaled by depth) until its
 * matching dock slot — an element rendered elsewhere with
 * id={`skill-slot-${item.id}`} — scrolls near the viewport, at which point it
 * eases toward that slot's live position/size and fades out right as it
 * arrives, revealing the slot's own icon underneath. Scroll back away and it
 * reappears and resumes floating.
 */
function FieldIcon({
  item,
  pointerX,
  pointerY,
}: {
  item: CursorFieldItem;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}) {
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);
  const scale = useSpring(1, SPRING);
  const opacity = useSpring(0.22 + item.depth * 0.5, SPRING);
  const dockingRef = useRef(false);

  useAnimationFrame(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const slot = document.getElementById(`skill-slot-${item.id}`);
    const rect = slot?.getBoundingClientRect();

    // Hysteresis: entering docking uses a tight band, but once docked it
    // takes a wider band to leave again, so scroll position sitting right on
    // the boundary doesn't flip between the two branches every frame.
    const docking = rect
      ? dockingRef.current
        ? rect.top < vh * 0.97 && rect.bottom > vh * 0.03
        : rect.top < vh * 0.92 && rect.bottom > vh * 0.08
      : false;

    // The grid's own icon (rendered by SkillsMatrix) starts hidden and only
    // reveals itself once this field icon docks — flip that shared signal
    // here, on the same slot element this effect already reads via its DOM
    // id, rather than introducing React state between the two components.
    if (slot && docking !== dockingRef.current) {
      slot.dataset.docked = docking ? "true" : "false";
    }
    dockingRef.current = docking;

    const baseOpacity = 0.22 + item.depth * 0.5;

    if (rect && docking) {
      const targetX = rect.left + rect.width / 2 - vw / 2;
      const targetY = rect.top + rect.height / 2 - vh / 2;

      // Fade only in the final approach to the slot, measured by actual
      // on-screen distance rather than tied to the x/y/scale springs'
      // own timing — otherwise opacity (a short path to 0) settles long
      // before position/scale (a long path to the slot) do, and the icon
      // vanishes mid-flight instead of visibly arriving.
      const dist = Math.hypot(x.get() - targetX, y.get() - targetY);
      const fadeRadius = Math.max(item.size * 1.5, 48);
      opacity.set(baseOpacity * Math.min(dist / fadeRadius, 1));

      x.set(targetX);
      y.set(targetY);
      scale.set(rect.width / item.size);
    } else {
      const influence = 0.16 + item.depth * 0.6;
      x.set(item.x * vw - vw / 2 + pointerX.get() * influence);
      y.set(item.y * vh - vh / 2 + pointerY.get() * influence);
      scale.set(1);
      opacity.set(baseOpacity);
    }
  });

  return (
    <motion.img
      src={item.src}
      alt=""
      aria-hidden
      draggable={false}
      data-mono={item.mono ? "" : undefined}
      style={{
        position: "fixed",
        left: "50%",
        top: "50%",
        marginLeft: -item.size / 2,
        marginTop: -item.size / 2,
        width: item.size,
        height: item.size,
        x,
        y,
        scale,
        opacity,
      }}
    />
  );
}

/**
 * Persistent cursor-parallax layer, mounted once at the root layout so it
 * spans every section rather than being scoped to one. Phase 1 mounted it
 * with an empty item list since nothing existed to dock into yet. Phase 2
 * supplies the real skill icons, each keyed to a dock slot rendered by the
 * skills matrix.
 */
export function CursorField({ items = [] }: { items?: CursorFieldItem[] }) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (reduced || coarsePointer) {
      // No field ever mounts for these visitors, so no FieldIcon will ever
      // dock and flip a slot's data-docked attribute. Mark every slot
      // revealed up front instead, reusing the same attribute SkillsMatrix
      // already reads, so the grid icons just show immediately.
      for (const item of items) {
        const slot = document.getElementById(`skill-slot-${item.id}`);
        if (slot) slot.dataset.docked = "true";
      }
      return;
    }

    // matchMedia is only available client-side, so whether the field renders
    // at all can only be decided once mounted, not during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);

    function handlePointerMove(e: PointerEvent) {
      pointerX.set(e.clientX - window.innerWidth / 2);
      pointerY.set(e.clientY - window.innerHeight / 2);
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [items, pointerX, pointerY]);

  if (!enabled || items.length === 0) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {items.map((item) => (
        <FieldIcon key={item.id} item={item} pointerX={pointerX} pointerY={pointerY} />
      ))}
    </div>
  );
}
