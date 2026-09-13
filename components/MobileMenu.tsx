"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock } from "@/components/Clock";

interface NavLink {
  href: string;
  label: string;
}

function MenuIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="7" x2="21" y2="7" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="17" x2="21" y2="17" />
    </svg>
  );
}

const OVERLAY_TRANSITION = { duration: 0.25, ease: [0.4, 0, 0.2, 1] } as const;

/** Drives the cascade: each row (clock, then one per link) is a step behind
 * the one above it via staggerChildren, so they come down like stairs
 * instead of all appearing at once. */
const LIST_VARIANTS = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
};

/**
 * Hamburger button + dropdown panel for the nav links, shown only below the
 * breakpoint where Nav hides its inline link row. The clock moves in here
 * too — see Nav.tsx — since the collapsed header has no room for it.
 */
export function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-[34px] w-[34px] items-center justify-center transition-colors duration-300 hover:text-[var(--ink)]"
        style={{ color: "var(--muted)" }}
      >
        <MenuIcon open={open} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              aria-hidden
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={OVERLAY_TRANSITION}
              className="fixed inset-0 z-40"
              style={{ background: "color-mix(in srgb, var(--ink) 25%, transparent)" }}
            />
            <motion.div
              key="panel"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={LIST_VARIANTS}
              className="absolute top-[calc(100%+18px)] right-0 z-50 flex w-[min(80vw,260px)] flex-col gap-5 border p-6"
              style={{ borderColor: "var(--rule)", background: "var(--paper)" }}
            >
              <motion.div variants={ITEM_VARIANTS} className="text-[11px] uppercase tracking-[0.12em]">
                <Clock />
              </motion.div>
              {links.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  variants={ITEM_VARIANTS}
                  className="text-[11px] uppercase tracking-[0.16em] transition-colors duration-300 hover:text-[var(--accent)]"
                >
                  {link.label}
                </motion.a>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
