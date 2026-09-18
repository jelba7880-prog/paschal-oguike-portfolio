import type { ReactNode } from "react";

interface SectionHeadlineProps {
  children: ReactNode;
  className?: string;
  /** Contact's headline wants the same italic treatment its mailto CTA
   * already carries; other sections leave this off. */
  italic?: boolean;
}

/** The large font-display headline every section leads with, under its
 * SectionLabel eyebrow. Sized one step below Hero's h1 so Hero keeps the
 * single biggest moment on the page. */
export function SectionHeadline({ children, className = "", italic = false }: SectionHeadlineProps) {
  return (
    <h2
      className={`font-display m-0 text-[clamp(32px,5vw,80px)] leading-[1.08] font-medium tracking-[-0.015em] text-balance ${
        italic ? "italic" : ""
      } ${className}`}
    >
      {children}
    </h2>
  );
}
