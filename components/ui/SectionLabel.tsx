import type { ElementType, ReactNode } from "react";

interface SectionLabelProps {
  children: ReactNode;
  className?: string;
  /** Element to render as. Defaults to `h2` since every current usage is a
   * top-level section header sitting below Hero's single `h1` — pass a
   * different tag only where that's genuinely not the right semantics. */
  as?: ElementType;
}

/** The recurring uppercase marker at the top of every section. */
export function SectionLabel({ children, className = "", as: Tag = "h2" }: SectionLabelProps) {
  return (
    <Tag
      className={`m-0 text-[11px] font-normal uppercase tracking-[0.18em] ${className}`}
      style={{ color: "var(--muted)" }}
    >
      {children}
    </Tag>
  );
}
