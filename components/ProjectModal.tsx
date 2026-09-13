"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/lib/projects-data";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, onClose]);

  useEffect(() => {
    if (!project) return;

    // Compensate for the scrollbar disappearing so locking scroll doesn't
    // shift the layout width.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="veil"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto p-[clamp(16px,4vh,56px)_clamp(12px,3vw,40px)]"
          style={{ background: "rgba(23,19,16,0.42)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.32, ease: [0.2, 0.9, 0.24, 1] }}
            className="relative w-full max-w-[920px]"
            style={{ background: "var(--card)", border: "1px solid var(--rule)", boxShadow: "0 40px 90px -40px rgba(23,19,16,0.6)" }}
          >
            <div className="relative border-b" style={{ borderColor: "var(--rule)" }}>
              <div className="aspect-video w-full" style={{ background: "var(--wash)" }} aria-hidden />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute top-3.5 right-3.5 flex h-[34px] w-[34px] items-center justify-center border text-[14px] transition-colors duration-300 hover:bg-[var(--ink)] hover:text-[var(--card)]"
                style={{ background: "var(--card)", borderColor: "var(--rule)", color: "var(--ink)" }}
              >
                ✕
              </button>
            </div>

            <div className="p-[clamp(24px,3.4vw,44px)]">
              <div className="flex items-center gap-3.5 text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--muted)" }}>
                <span style={{ color: "var(--accent)" }}>{project.number}</span>
                <span>{project.status}</span>
                <span className="h-px flex-1" style={{ background: "var(--rule)" }} />
              </div>

              <h3 className="font-display mt-3.5 mb-5 text-[clamp(28px,3.4vw,44px)] leading-[1.1] font-normal tracking-[-0.015em]">
                {project.title}
              </h3>

              <p
                className="mb-[clamp(28px,3.4vw,40px)] text-[clamp(17px,1.7vw,22px)] leading-[1.5] text-pretty italic"
                style={{ color: "var(--ink)" }}
              >
                {project.tagline}
              </p>

              <div
                className="flex flex-col gap-[clamp(24px,3vw,40px)] border-t pt-10 pb-10"
                style={{ borderColor: "var(--rule)" }}
              >
                <div>
                  <div className="mb-3 text-center text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--accent)" }}>
                    The problem
                  </div>
                  <p className="m-0 text-[14.5px] leading-[1.65] text-pretty" style={{ color: "var(--body)" }}>
                    {project.problem}
                  </p>
                </div>
                <div>
                  <div className="mb-3 text-center text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--accent)" }}>
                    What broke
                  </div>
                  <ul className="m-0 flex list-none flex-col gap-3 p-0 text-[14.5px] leading-[1.6]" style={{ color: "var(--body)" }}>
                    {project.whatBroke.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t pt-10" style={{ borderColor: "var(--rule)" }}>
                <div className="mb-3 text-center text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--accent)" }}>
                  Decisions
                </div>
                <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-[14.5px] leading-[1.6]" style={{ color: "var(--body)" }}>
                  {project.decisions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div
                className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t pt-5"
                style={{ borderColor: "var(--rule)" }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  {project.techIcons.map((icon) => (
                    <span
                      key={icon.label}
                      title={icon.label}
                      className="flex h-[34px] w-[34px] items-center justify-center border"
                      style={{ borderColor: "var(--rule)" }}
                    >
                      <img
                        src={icon.src}
                        alt={icon.label}
                        data-mono={icon.mono ? "" : undefined}
                        width={17}
                        height={17}
                        className="block"
                      />
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <span
                    className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.12em]"
                    style={{ color: "var(--muted)" }}
                  >
                    <img src="https://cdn.simpleicons.org/github/8a8177" alt="" width={13} height={13} className="block" />
                    Codebase is private
                  </span>
                  <a href={project.liveSiteHref} className="text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--accent)" }}>
                    View live site →
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
