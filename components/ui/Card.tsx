import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

/** Shared surface for the project grid (Phase 2) and similar boxed content. */
export function Card({ children, interactive = false, onClick, className = "" }: CardProps) {
  const classes = `flex flex-col border p-[22px] transition-all duration-300 ${
    interactive
      ? "cursor-pointer hover:-translate-y-1.5 hover:border-[var(--ink)] hover:shadow-[0_22px_44px_-26px_rgba(23,19,16,0.5)]"
      : ""
  } ${className}`;

  return (
    <div
      onClick={onClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      className={classes}
      style={{ background: "var(--card)", borderColor: "var(--rule)" }}
    >
      {children}
    </div>
  );
}
