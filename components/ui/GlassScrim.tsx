interface GlassScrimProps {
  /** Backdrop blur radius in px. Defaults to 13 — the strength used to fully
   * hide the CursorField swarm behind opaque card/list content. */
  blur?: number;
  /** Opacity (0-100) of the --paper tint mixed into the glass. Defaults to
   * 38 — lower it alongside `blur` where some of what's behind should still
   * show through (e.g. a decorative background image). */
  tint?: number;
}

/**
 * Liquid-glass backdrop for content blocks that sit over the floating
 * CursorField layer (see components/CursorField.tsx). Reads its tint from
 * the section's own --paper token via color-mix, so it tracks light/dark
 * (and any data-inverse) automatically instead of a hardcoded color.
 *
 * The parent must establish a stacking context above the field
 * (e.g. `relative z-[21]`, since CursorField renders at z-20) — otherwise
 * the field paints on top of this scrim instead of blurring behind it.
 */
export function GlassScrim({ blur = 13, tint = 38 }: GlassScrimProps = {}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        background: `color-mix(in srgb, var(--paper) ${tint}%, transparent)`,
        backdropFilter: `blur(${blur}px) saturate(190%)`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(190%)`,
        boxShadow: "0 12px 40px -16px rgba(0,0,0,0.28)",
      }}
    />
  );
}
