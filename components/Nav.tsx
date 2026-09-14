import { Clock } from "@/components/Clock";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileMenu } from "@/components/MobileMenu";

const NAV_LINKS = [
  { href: "#work", label: "Work" },
  { href: "#stack", label: "Stack" },
  { href: "#notes", label: "Notes" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  return (
    <header
      className="relative z-30 flex items-center justify-between gap-4 border-b px-[clamp(24px,4.5vw,64px)] py-[26px]"
      style={{ borderColor: "var(--rule)", background: "var(--paper)" }}
    >
      <a href="#top" className="font-display text-xl font-medium italic tracking-[0.01em]">
        Paschal
      </a>

      <nav className="hidden flex-wrap items-baseline gap-x-[30px] gap-y-3 text-[11px] uppercase tracking-[0.16em] md:flex">
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} className="transition-colors duration-300 hover:text-[var(--accent)]">
            {link.label}
          </a>
        ))}
      </nav>

      <div className="hidden items-center gap-[18px] md:flex">
        <Clock />
        <ThemeToggle />
      </div>

      <div className="flex items-center gap-3 md:hidden">
        <ThemeToggle />
        <MobileMenu links={NAV_LINKS} />
      </div>
    </header>
  );
}
