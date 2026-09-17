import type { ElementType, ReactNode } from "react";

interface SectionLabelProps {
  children: ReactNode;
  className?: string;
  /** Element to render as. Defaults to `h2` since every current usage is a
   * top-level section header sitting below Hero's single `h1` — pass a
   * different tag only where that's genuinely not the right semantics. */
  as?: ElementType;
}

/** The recurring uppercase marker at the top of every section. Set in the
 * display serif (Bodoni Moda) at its bold weight rather than the body sans,
 * so section headers read as editorial type distinct from every other line
 * of text on the page. */
export function SectionLabel({ children, className = "", as: Tag = "h2" }: SectionLabelProps) {
  return (
    <Tag
      className={`font-display m-0 text-[clamp(13px,1.1vw,15px)] font-bold uppercase tracking-[0.14em] ${className}`}
      style={{ color: "var(--body)" }}
    >
      {children}
    </Tag>
  );
}
