"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import type { ProjectTechIcon } from "@/lib/projects-data";

/** Matches gap-2.5 (0.625rem), used both by the visible row and by the width math below. */
const ICON_GAP = 10;

function TechIconImg({
  icon,
  imgRef,
}: {
  icon: ProjectTechIcon;
  imgRef?: (el: HTMLImageElement | null) => void;
}) {
  return (
    <img
      ref={imgRef}
      src={icon.src}
      alt={icon.label}
      title={icon.label}
      data-mono={icon.mono ? "" : undefined}
      width={14}
      height={14}
      className="block shrink-0"
    />
  );
}

/**
 * One line of tech icons for the expanded/flat project card. A hidden copy of
 * every icon plus a worst-case "+N" chip is measured against the visible
 * container's actual width; whichever icons don't fit are dropped in favor of
 * a single real "+N" chip sized to however many were actually cut. Recomputes
 * on mount, on container resize, and when the icon list changes — never on
 * every render.
 */
export function TechIconRow({ icons }: { icons: ProjectTechIcon[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLImageElement | null)[]>([]);
  const chipRef = useRef<HTMLSpanElement>(null);
  const [visibleCount, setVisibleCount] = useState(icons.length);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function recalculate() {
      const containerWidth = container!.clientWidth;
      const chipWidth = chipRef.current?.getBoundingClientRect().width ?? 0;
      let used = 0;
      let fit = icons.length;

      for (let i = 0; i < icons.length; i++) {
        const width = itemRefs.current[i]?.getBoundingClientRect().width ?? 0;
        const next = used + (i > 0 ? ICON_GAP : 0) + width;
        const remaining = icons.length - (i + 1);
        const reserve = remaining > 0 ? ICON_GAP + chipWidth : 0;
        if (next + reserve > containerWidth) {
          fit = i;
          break;
        }
        used = next;
      }

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisibleCount(fit);
    }

    recalculate();
    const observer = new ResizeObserver(recalculate);
    observer.observe(container);
    return () => observer.disconnect();
  }, [icons]);

  const hiddenCount = icons.length - visibleCount;

  return (
    <div ref={containerRef} className="relative flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden">
      {/* Hidden measuring pass: every icon plus a worst-case chip, laid out
          off-screen at natural width so the real fit can be computed before
          anything visible ever overflows. */}
      <div className="invisible pointer-events-none absolute flex items-center gap-2.5" aria-hidden="true">
        {icons.map((icon, i) => (
          <TechIconImg
            key={icon.label}
            icon={icon}
            imgRef={(el) => {
              itemRefs.current[i] = el;
            }}
          />
        ))}
        <span ref={chipRef} className="inline-flex">
          <Badge variant="tag">+{icons.length}</Badge>
        </span>
      </div>

      {icons.slice(0, visibleCount).map((icon) => (
        <TechIconImg key={icon.label} icon={icon} />
      ))}
      {hiddenCount > 0 && <Badge variant="tag">+{hiddenCount}</Badge>}
    </div>
  );
}
