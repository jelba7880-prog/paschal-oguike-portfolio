"use client";

import { useEffect, useState } from "react";
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

  useAnimationFrame(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const slot = document.getElementById(`skill-slot-${item.id}`);
    const rect = slot?.getBoundingClientRect();
    const docking = rect ? rect.top < vh * 0.92 && rect.bottom > vh * 0.08 : false;

    if (rect && docking) {
      x.set(rect.left + rect.width / 2 - vw / 2);
      y.set(rect.top + rect.height / 2 - vh / 2);
      scale.set(rect.width / item.size);
      opacity.set(0);
    } else {
      const influence = 0.16 + item.depth * 0.6;
      x.set(item.x * vw - vw / 2 + pointerX.get() * influence);
      y.set(item.y * vh - vh / 2 + pointerY.get() * influence);
      scale.set(1);
      opacity.set(0.22 + item.depth * 0.5);
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
    if (reduced || coarsePointer) return;

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
  }, [items.length, pointerX, pointerY]);

  if (!enabled || items.length === 0) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {items.map((item) => (
        <FieldIcon key={item.id} item={item} pointerX={pointerX} pointerY={pointerY} />
      ))}
    </div>
  );
}
