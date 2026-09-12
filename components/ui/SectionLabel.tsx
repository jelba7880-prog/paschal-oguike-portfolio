import type { ReactNode } from "react";

interface SectionLabelProps {
  children: ReactNode;
  className?: string;
}

/** The recurring uppercase marker at the top of every section. */
export function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <div
      className={`text-[11px] uppercase tracking-[0.18em] ${className}`}
      style={{ color: "var(--muted)" }}
    >
      {children}
    </div>
  );
}
