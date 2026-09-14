export interface Skill {
  id: string;
  label: string;
  src: string;
  /** True for single-color (near-black) marks that need inverting in dark mode. */
  mono?: boolean;
  /** Icon size in px, used both in the grid and by the floating field. */
  size: number;
  /** 0 (far, barely reacts to the cursor) .. 1 (near, reacts most). */
  depth: number;
  /** Initial floating position as a fraction of the viewport, 0-1. */
  x: number;
  y: number;
}

export interface SkillCategory {
  title: string;
  items: Skill[];
}

const ICONS = "https://cdn.simpleicons.org";

/** Original glyphs for tools with no official brand icon available. */
const ORIGINAL_ICONS = {
  serwist: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#111111" d="M11 2h2v9h4l-5 6-5-6h4V2Z M4 20h16v2H4Z"/></svg>`,
  openExchangeRates: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#111111" d="M2 6h14V4l6 3-6 3v-2H2z M22 18h-14v2l-6-3 6-3v2h14z"/></svg>`,
  reactPdf: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#111111" fill-rule="evenodd" d="M5 2h9l5 5v15H5z M8 12h8v1.5H8z M8 15h8v1.5H8z M8 18h5v1.5H8z"/></svg>`,
  twilio: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#111111" d="M3 4h18v13H9l-4 4v-4H3z"/></svg>`,
};

function svgDataUri(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Languages",
    items: [
      { id: "javascript", label: "JavaScript", src: `${ICONS}/javascript`, size: 46, depth: 0.62, x: 0.19, y: 0.185 },
      { id: "python", label: "Python", src: `${ICONS}/python`, size: 32, depth: 0.22, x: 0.33, y: 0.185 },
      { id: "typescript", label: "TypeScript", src: `${ICONS}/typescript`, size: 48, depth: 0.7, x: 0.755, y: 0.19 },
      { id: "html5", label: "HTML5", src: `${ICONS}/html5`, size: 34, depth: 0.3, x: 0.905, y: 0.225 },
    ],
  },
  {
    title: "Frontend",
    items: [
      { id: "react", label: "React", src: `${ICONS}/react`, size: 52, depth: 0.78, x: 0.085, y: 0.295 },
      { id: "next", label: "Next.js", src: `${ICONS}/nextdotjs`, mono: true, size: 30, depth: 0.2, x: 0.205, y: 0.32 },
      { id: "tailwind", label: "Tailwind", src: `${ICONS}/tailwindcss`, size: 38, depth: 0.44, x: 0.335, y: 0.28 },
      { id: "css", label: "CSS", src: `${ICONS}/css`, size: 27, depth: 0.13, x: 0.935, y: 0.315 },
      { id: "zod", label: "Zod", src: `${ICONS}/zod`, size: 26, depth: 0.12, x: 0.265, y: 0.205 },
      { id: "react-hook-form", label: "react-hook-form", src: `${ICONS}/reacthookform`, size: 36, depth: 0.34, x: 0.665, y: 0.3 },
      { id: "react-query", label: "TanStack React Query", src: `${ICONS}/reactquery`, size: 44, depth: 0.58, x: 0.8, y: 0.255 },
    ],
  },
  {
    title: "Database & cloud",
    items: [
      { id: "postgresql", label: "Postgres", src: `${ICONS}/postgresql`, size: 50, depth: 0.72, x: 0.06, y: 0.6 },
      { id: "mongodb", label: "MongoDB", src: `${ICONS}/mongodb`, size: 33, depth: 0.3, x: 0.165, y: 0.645 },
      { id: "supabase", label: "Supabase", src: `${ICONS}/supabase`, size: 45, depth: 0.62, x: 0.945, y: 0.655 },
      { id: "neon", label: "Neon Postgres", src: `${ICONS}/neon`, size: 28, depth: 0.15, x: 0.775, y: 0.555 },
      { id: "drizzle", label: "Drizzle ORM", src: `${ICONS}/drizzle`, size: 38, depth: 0.4, x: 0.845, y: 0.6 },
    ],
  },
  {
    title: "DevOps & tools",
    items: [
      { id: "node", label: "Node.js", src: `${ICONS}/nodedotjs`, size: 42, depth: 0.5, x: 0.115, y: 0.355 },
      { id: "git", label: "Git", src: `${ICONS}/git`, size: 31, depth: 0.24, x: 0.22, y: 0.72 },
      { id: "github", label: "GitHub", src: `${ICONS}/github`, mono: true, size: 47, depth: 0.68, x: 0.36, y: 0.78 },
      { id: "vercel", label: "Vercel", src: `${ICONS}/vercel`, mono: true, size: 39, depth: 0.46, x: 0.65, y: 0.785 },
      { id: "vscode", label: "VS Code", src: "/icons/vscode.svg", size: 36, depth: 0.36, x: 0.045, y: 0.9 },
      { id: "turborepo", label: "Turborepo", src: `${ICONS}/turborepo`, size: 44, depth: 0.55, x: 0.09, y: 0.76 },
      { id: "claude", label: "Claude", src: `${ICONS}/claude`, size: 33, depth: 0.28, x: 0.765, y: 0.94 },
    ],
  },
  {
    title: "Integrations",
    items: [
      {
        id: "twilio",
        label: "Twilio",
        src: svgDataUri(ORIGINAL_ICONS.twilio),
        mono: true,
        size: 40,
        depth: 0.5,
        x: 0.51,
        y: 0.73,
      },
      {
        id: "open-exchange-rates",
        label: "Open Exchange Rates",
        src: svgDataUri(ORIGINAL_ICONS.openExchangeRates),
        mono: true,
        size: 34,
        depth: 0.34,
        x: 0.325,
        y: 0.89,
      },
      {
        id: "react-pdf",
        label: "@react-pdf/renderer",
        src: svgDataUri(ORIGINAL_ICONS.reactPdf),
        mono: true,
        size: 42,
        depth: 0.56,
        x: 0.62,
        y: 0.885,
      },
    ],
  },
  {
    title: "PWA",
    items: [
      {
        id: "serwist",
        label: "Serwist",
        src: svgDataUri(ORIGINAL_ICONS.serwist),
        mono: true,
        size: 38,
        depth: 0.44,
        x: 0.18,
        y: 0.945,
      },
    ],
  },
];

export const ALL_SKILLS: Skill[] = SKILL_CATEGORIES.flatMap((category) => category.items);
