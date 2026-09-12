import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  interactive?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}

/** Shared surface for the project grid and similar boxed content. */
export function Card({ children, interactive = false, href, onClick, className = "" }: CardProps) {
  const classes = `flex flex-col border p-[22px] transition-all duration-300 ${
    interactive
      ? "cursor-pointer hover:-translate-y-1.5 hover:border-[var(--ink)] hover:shadow-[0_22px_44px_-26px_rgba(23,19,16,0.5)]"
      : ""
  } ${className}`;
  const style = { background: "var(--card)", borderColor: "var(--rule)" };

  if (href) {
    return (
      <a href={href} onClick={onClick} className={classes} style={style}>
        {children}
      </a>
    );
  }

  return (
    <div
      onClick={onClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      className={classes}
      style={style}
    >
      {children}
    </div>
  );
}
