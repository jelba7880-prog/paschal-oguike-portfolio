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

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Languages",
    items: [
      { id: "java", label: "Java", src: `${ICONS}/openjdk`, mono: true, size: 36, depth: 0.38, x: 0.05, y: 0.185 },
      { id: "javascript", label: "JavaScript", src: `${ICONS}/javascript`, size: 46, depth: 0.62, x: 0.19, y: 0.185 },
      { id: "python", label: "Python", src: `${ICONS}/python`, size: 32, depth: 0.22, x: 0.33, y: 0.185 },
      { id: "c", label: "C", src: `${ICONS}/c`, size: 40, depth: 0.5, x: 0.47, y: 0.2 },
      { id: "cpp", label: "C++", src: `${ICONS}/cplusplus`, size: 28, depth: 0.16, x: 0.615, y: 0.225 },
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
      { id: "vite", label: "Vite", src: `${ICONS}/vite`, size: 44, depth: 0.58, x: 0.8, y: 0.255 },
      { id: "css", label: "CSS", src: `${ICONS}/css`, size: 27, depth: 0.13, x: 0.935, y: 0.315 },
      { id: "figma", label: "Figma", src: `${ICONS}/figma`, size: 36, depth: 0.34, x: 0.665, y: 0.3 },
    ],
  },
  {
    title: "Backend",
    items: [
      { id: "node", label: "Node.js", src: `${ICONS}/nodedotjs`, size: 42, depth: 0.5, x: 0.115, y: 0.355 },
      { id: "express", label: "Express", src: `${ICONS}/express`, mono: true, size: 32, depth: 0.26, x: 0.235, y: 0.455 },
      { id: "fastapi", label: "FastAPI", src: `${ICONS}/fastapi`, size: 46, depth: 0.66, x: 0.86, y: 0.445 },
      { id: "flask", label: "Flask", src: `${ICONS}/flask`, mono: true, size: 29, depth: 0.18, x: 0.955, y: 0.49 },
      { id: "graphql", label: "GraphQL", src: `${ICONS}/graphql`, size: 26, depth: 0.12, x: 0.265, y: 0.205 },
    ],
  },
  {
    title: "Database & cloud",
    items: [
      { id: "postgresql", label: "Postgres", src: `${ICONS}/postgresql`, size: 50, depth: 0.72, x: 0.06, y: 0.6 },
      { id: "mongodb", label: "MongoDB", src: `${ICONS}/mongodb`, size: 33, depth: 0.3, x: 0.165, y: 0.645 },
      { id: "redis", label: "Redis", src: `${ICONS}/redis`, size: 38, depth: 0.4, x: 0.845, y: 0.6 },
      { id: "supabase", label: "Supabase", src: `${ICONS}/supabase`, size: 45, depth: 0.62, x: 0.945, y: 0.655 },
      { id: "mysql", label: "MySQL", src: `${ICONS}/mysql`, size: 28, depth: 0.15, x: 0.775, y: 0.555 },
    ],
  },
  {
    title: "DevOps & tools",
    items: [
      { id: "docker", label: "Docker", src: `${ICONS}/docker`, size: 44, depth: 0.55, x: 0.09, y: 0.76 },
      { id: "git", label: "Git", src: `${ICONS}/git`, size: 31, depth: 0.24, x: 0.22, y: 0.72 },
      { id: "github", label: "GitHub", src: `${ICONS}/github`, mono: true, size: 47, depth: 0.68, x: 0.36, y: 0.78 },
      { id: "linux", label: "Linux", src: `${ICONS}/linux`, mono: true, size: 27, depth: 0.14, x: 0.51, y: 0.73 },
      { id: "vercel", label: "Vercel", src: `${ICONS}/vercel`, mono: true, size: 39, depth: 0.46, x: 0.65, y: 0.785 },
      { id: "bash", label: "Bash", src: `${ICONS}/gnubash`, mono: true, size: 34, depth: 0.32, x: 0.79, y: 0.72 },
      {
        id: "aws",
        label: "AWS",
        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
        size: 48,
        depth: 0.6,
        x: 0.92,
        y: 0.775,
      },
      { id: "vscode", label: "VS Code", src: `${ICONS}/vscodium/1f9cf0`, size: 36, depth: 0.36, x: 0.045, y: 0.9 },
    ],
  },
  {
    title: "AI & core",
    items: [
      { id: "pytorch", label: "PyTorch", src: `${ICONS}/pytorch`, size: 44, depth: 0.58, x: 0.18, y: 0.945 },
      { id: "opencv", label: "OpenCV", src: `${ICONS}/opencv`, size: 30, depth: 0.2, x: 0.325, y: 0.89 },
      { id: "sklearn", label: "scikit-learn", src: `${ICONS}/scikitlearn`, size: 41, depth: 0.5, x: 0.475, y: 0.935 },
      {
        id: "chatgpt",
        label: "ChatGPT",
        src: "https://cdn.jsdelivr.net/npm/simple-icons@11.14.0/icons/openai.svg",
        mono: true,
        size: 50,
        depth: 0.74,
        x: 0.62,
        y: 0.885,
      },
      { id: "claude", label: "Claude", src: `${ICONS}/claude`, size: 33, depth: 0.28, x: 0.765, y: 0.94 },
      { id: "gemini", label: "Gemini", src: `${ICONS}/googlegemini`, size: 38, depth: 0.42, x: 0.9, y: 0.895 },
    ],
  },
];

export const ALL_SKILLS: Skill[] = SKILL_CATEGORIES.flatMap((category) => category.items);
