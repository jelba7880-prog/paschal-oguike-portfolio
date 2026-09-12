import type { ReactNode } from "react";

interface SectionLabelProps {
  number: string;
  children: ReactNode;
  className?: string;
}

/** The recurring "01 POSITIONING" style marker at the top of every section. */
export function SectionLabel({ number, children, className = "" }: SectionLabelProps) {
  return (
    <div
      className={`text-[11px] uppercase tracking-[0.18em] ${className}`}
      style={{ color: "var(--muted)" }}
    >
      <span style={{ color: "var(--accent)" }}>{number}</span>
      <span className="ml-2.5">{children}</span>
    </div>
  );
}
