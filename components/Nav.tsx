import { Clock } from "@/components/Clock";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV_LINKS = [
  { href: "#work", label: "Work" },
  { href: "#process", label: "Process" },
  { href: "#stack", label: "Stack" },
  { href: "#record", label: "Record" },
  { href: "#notes", label: "Notes" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  return (
    <header
      className="relative z-30 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4 border-b px-[clamp(24px,4.5vw,64px)] py-[26px]"
      style={{ borderColor: "var(--rule)", background: "var(--paper)" }}
    >
      <a href="#top" className="font-display text-xl font-medium italic tracking-[0.01em]">
        Paschal
      </a>

      <nav className="flex flex-wrap gap-x-[30px] gap-y-3 text-[11px] uppercase tracking-[0.16em]">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} className="transition-colors duration-300 hover:text-[var(--accent)]">
            {link.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-[18px]">
        <Clock />
        <ThemeToggle />
      </div>
    </header>
  );
}
