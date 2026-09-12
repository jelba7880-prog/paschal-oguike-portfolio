"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, type MotionValue } from "framer-motion";

export interface CursorFieldItem {
  id: string;
  /** Icon source (e.g. a simpleicons.org URL). */
  src: string;
  size: number;
  /** 0 (far, barely reacts to the cursor) .. 1 (near, reacts most). */
  depth: number;
  /** Initial position as a fraction of the viewport, 0-1. */
  x: number;
  y: number;
}

function FieldIcon({
  item,
  pointerX,
  pointerY,
}: {
  item: CursorFieldItem;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}) {
  const offsetX = useSpring(0, { stiffness: 120, damping: 20 });
  const offsetY = useSpring(0, { stiffness: 120, damping: 20 });

  useEffect(() => {
    const unsubX = pointerX.on("change", (v) => offsetX.set(v * item.depth));
    const unsubY = pointerY.on("change", (v) => offsetY.set(v * item.depth));
    return () => {
      unsubX();
      unsubY();
    };
  }, [pointerX, pointerY, item.depth, offsetX, offsetY]);

  return (
    <motion.img
      src={item.src}
      alt=""
      aria-hidden
      draggable={false}
      style={{
        position: "absolute",
        left: `${item.x * 100}%`,
        top: `${item.y * 100}%`,
        width: item.size,
        height: item.size,
        x: offsetX,
        y: offsetY,
        opacity: 0.22 + item.depth * 0.5,
      }}
    />
  );
}

/**
 * Persistent cursor-parallax layer, mounted once at the root layout so it
 * spans every section rather than being scoped to one. Phase 1 mounts it
 * with an empty item list — there is nothing to dock into yet, since the
 * skills grid it targets doesn't exist until Phase 2/3. Phase 2 passes the
 * real icon set (plus, eventually, scroll-linked docking) once that grid
 * exists to dock into.
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
    <div aria-hidden className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {items.map((item) => (
        <FieldIcon key={item.id} item={item} pointerX={pointerX} pointerY={pointerY} />
      ))}
    </div>
  );
}
