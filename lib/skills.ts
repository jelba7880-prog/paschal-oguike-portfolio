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

/**
 * Original monochrome line glyphs for the Hobbies row — generic concepts
 * only, deliberately not the real logos/marks they evoke (no Mercedes
 * tri-star, PlayStation mark, God of War emblem, Rockstar "R"/GTA wordmark,
 * Google's pin, or TikTok note), since this portfolio can't ship copyrighted
 * or trademarked brand art. Same 24x24 viewBox / 1.6 stroke / round caps
 * convention as Footer's PinIcon, so the row reads as one consistent set —
 * the "local guide" glyph below is that same pin path reused directly.
 */
const HOBBY_ICONS = {
  car: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#111111" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 16h-1a1 1 0 0 1-1-1v-2.3c0-.5.3-.9.7-1.1l2.6-1.3 1.8-2.7A2 2 0 0 1 8.3 6.6h5.7c.8 0 1.5.4 1.9 1.1l1.7 2.6 2.6 1.3c.4.2.7.6.7 1.1V15a1 1 0 0 1-1 1h-1"/><path d="M7 16h10"/><circle cx="7" cy="16.3" r="1.6"/><circle cx="17" cy="16.3" r="1.6"/></svg>`,
  gamepad: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#111111" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 8.5h10a4 4 0 0 1 4 4.3l-.4 2.6a2.3 2.3 0 0 1-4.2 1L15 15H9l-1.4 1.4a2.3 2.3 0 0 1-4.2-1L3 12.8a4 4 0 0 1 4-4.3Z"/><path d="M7.3 11v3M5.8 12.5h3"/><circle cx="17" cy="11.5" r="0.9" fill="#111111" stroke="none"/><circle cx="14.7" cy="13.5" r="0.9" fill="#111111" stroke="none"/></svg>`,
  axe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#111111" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M11.5 3v17.5"/><path d="M11.5 4c3.2-2.2 7.5-1 8.3 2.4.8 3.4-2.3 6.6-6.3 6.4-1-.1-1.7-.4-2-.7"/></svg>`,
  chess: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#111111" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.2v3M10.4 4.7h3.2"/><path d="M9 9.3c0-1.8 1.3-3.2 3-3.2s3 1.4 3 3.2l1.1 6.2H7.9L9 9.3Z"/><path d="M7.3 18.5h9.4"/><path d="M7.8 15.5h8.4"/></svg>`,
  football: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#111111" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 8.2 15 10.4l-1.1 3.6h-3.8L9 10.4 12 8.2Z"/><path d="M12 8.2V5M15 10.4l2.9-1.1M13.9 14l1.6 2.7M10.1 14l-1.6 2.7M9 10.4l-2.9-1.1"/></svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#111111" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.7 14.3 8.7 19.8 9.4 15.8 13.2 16.9 18.6 12 15.9 7.1 18.6 8.2 13.2 4.2 9.4 9.7 8.7 12 3.7Z"/></svg>`,
  pin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#111111" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/></svg>`,
  playFrame: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#111111" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M10 8.3v7.4l6.2-3.7L10 8.3Z" fill="#111111" stroke="none"/></svg>`,
  steeringWheel: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#111111" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.3"/><path d="M12 6.3v3.4M7.5 15.2l3-1.6M16.5 15.2l-3-1.6"/></svg>`,
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
    title: "Hobbies",
    items: [
      {
        id: "mercedes",
        label: "Mercedes",
        src: svgDataUri(HOBBY_ICONS.car),
        mono: true,
        size: 40,
        depth: 0.4,
        x: 0.06,
        y: 0.5,
      },
      {
        id: "gaming",
        label: "Gaming",
        src: svgDataUri(HOBBY_ICONS.gamepad),
        mono: true,
        size: 42,
        depth: 0.52,
        x: 0.94,
        y: 0.44,
      },
      {
        id: "god-of-war",
        label: "God of War",
        src: svgDataUri(HOBBY_ICONS.axe),
        mono: true,
        size: 36,
        depth: 0.3,
        x: 0.5,
        y: 0.05,
      },
      {
        id: "chess",
        label: "Chess",
        src: svgDataUri(HOBBY_ICONS.chess),
        mono: true,
        size: 34,
        depth: 0.26,
        x: 0.88,
        y: 0.85,
      },
      {
        id: "football",
        label: "Football",
        src: svgDataUri(HOBBY_ICONS.football),
        mono: true,
        size: 38,
        depth: 0.36,
        x: 0.12,
        y: 0.06,
      },
      {
        id: "gta",
        label: "GTA",
        src: svgDataUri(HOBBY_ICONS.star),
        mono: true,
        size: 32,
        depth: 0.22,
        x: 0.42,
        y: 0.96,
      },
      {
        id: "local-guide",
        label: "Local Guide",
        src: svgDataUri(HOBBY_ICONS.pin),
        mono: true,
        size: 36,
        depth: 0.32,
        x: 0.72,
        y: 0.06,
      },
      {
        id: "tiktok",
        label: "TikTok",
        src: svgDataUri(HOBBY_ICONS.playFrame),
        mono: true,
        size: 34,
        depth: 0.28,
        x: 0.03,
        y: 0.78,
      },
      {
        id: "car-culture",
        label: "Car Culture",
        src: svgDataUri(HOBBY_ICONS.steeringWheel),
        mono: true,
        size: 40,
        depth: 0.46,
        x: 0.58,
        y: 0.5,
      },
    ],
  },
];

export const ALL_SKILLS: Skill[] = SKILL_CATEGORIES.flatMap((category) => category.items);
