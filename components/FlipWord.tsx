"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface FlipWordProps {
  words: string[];
  /** Cadence between words, in ms. */
  intervalMs?: number;
  /** One color per word (same length as `words`); falls back to --accent for
   * any word past the end of this array, or entirely if omitted. */
  colors?: string[];
}

/**
 * A fixed-size "slot" showing one word from `words` at a time, advancing on
 * an interval with an odometer-style scroll: the outgoing word slides up and
 * out while the incoming one slides up into place from below.
 *
 * The slot's width/height is set by an invisible span holding the longest
 * word in the list, in the same flow as visible text — so it reserves real
 * space via normal layout rather than a guessed pixel/ch value, and never
 * changes size when a shorter or longer word rotates in. The visible word
 * sits in a second, absolutely-positioned span on top of that sizer (inset-0
 * against it directly, with no padding in between — the chip's own padding
 * lives one level up, outside the clipped/sized box, so it can't throw the
 * inset-0 match off).
 */
export function FlipWord({ words, intervalMs = 2200, colors }: FlipWordProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // matchMedia is only available client-side, so this can't be decided
    // during render — same pattern as CursorField's reduced-motion check.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (words.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % words.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [words.length, intervalMs]);

  const longestWord = words.reduce((longest, word) => (word.length > longest.length ? word : longest), "");
  const word = words[activeIndex];
  const color = colors?.[activeIndex] ?? "var(--accent)";

  return (
    <span className="inline-flex align-baseline" style={{ padding: "0 0.18em" }}>
      <span className="relative inline-block overflow-hidden">
        {/* Sizer: real text, invisible, reserves the slot's width/height via
            normal layout so it can never change when the active word does. */}
        <span aria-hidden className="invisible whitespace-nowrap">
          {longestWord}
        </span>

        {reducedMotion ? (
          <span className="absolute inset-0 flex items-center justify-center whitespace-nowrap" style={{ color }}>
            {word}
          </span>
        ) : (
          <AnimatePresence>
            <motion.span
              key={word}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
              style={{ color }}
            >
              {word}
            </motion.span>
          </AnimatePresence>
        )}
      </span>
    </span>
  );
}
