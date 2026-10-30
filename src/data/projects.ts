import { Project } from '@/types/project'

export const projects: Project[] = [
  {
    id: "reposense",
    title: "RepoSense",
    description: "Turn any GitHub repo into an interactive wiki you can chat with and explore in seconds.",
    longDescription:
      "RepoSense scans your GitHub repo to build a clear, interactive wiki for your code. Just ask questions in plain English to understand how everything works, with direct links to the exact lines of code.",
    liveLink: "https://reposense.aash7.xyz/",
    githubLink: "https://github.com/Ankesh-Singh/reposense",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/reposense.png",
    tags: [
      "Next.js 15",
      "TypeScript",
      "Hono",
      "PostgreSQL",
      "Neon",
      "pgvector",
      "Prisma",
      "Clerk",
      "Tailwind CSS",
      "Vercel AI SDK",
      "Mermaid.js"
    ],
    category: "Fullstack"
  },

  {
    id: "snip",
    title: "Snip",
    description: "Fast link shortener that redirects in milliseconds and tracks where your clicks come from.",
    longDescription:
      "Create clean, custom short links that send visitors to their destination at lightning speed. Includes a live dashboard to see clicks, visitor locations, and real-time link performance.",
    liveLink: "https://snip.aash7.xyz/",
    githubLink: "https://github.com/Ankesh-Singh/snip",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/r7.png",
    tags: [
      "Next.js",
      "TypeScript",
      "Hono",
      "Cloudflare Workers",
      "Supabase",
      "Postgres",
      "Drizzle",
      "Redis Streams",
      "Cloudflare Analytics Engine",
      "Sentry"
    ],
    category: "Fullstack"
  },
  {
    id: "blitzr",
    title: "Blitzr",
    description: "Play real-time chess online with friends, spectate live games, and review mistakes.",
    longDescription:
      "A fast multiplayer chess app where you can challenge opponents, chat during matches, and climb the leaderboard. When the game ends, review move-by-move breakdowns to spot blunders and improve.",
    liveLink: "https://blitzr.vercel.app/",
    githubLink: "https://github.com/Ankesh-Singh/Blitzr",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/chess.png",
    tags: ["Next.js", "TailwindCSS", "Python", "FastAPI", "Socket.IO", "Supabase", "Chess.js", "TypeScript"],
    category: "Fullstack"
  },
 {
    id: "devrooms",
    title: "DevRooms",
    description: "Virtual rooms where developers code together in real time with built-in video chat.",
    longDescription:
      "Hop into collaborative coding rooms with team members, jump on a live video call, and sync up your GitHub projects in one shared browser workspace.",
    liveLink: "https://dev-finder-amber-chi.vercel.app",
    githubLink: "https://github.com/Ethan4582/dev-rooms",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/devfinder.png",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "TailwindCSS", "Shadcn UI", "Framer Motion", "NextAuth", "GetStream SDK"],
    category: "Fullstack"
  },

  {
    id: "interview-kickstart",
    title: "Interview Kickstart",
    description: "Sleek landing page redesign built with buttery-smooth scroll interactions.",
    longDescription:
      "A modern, responsive landing page revamp for tech interview prep, packed with fluid linear scroll motion, snappy micro-interactions, and a fresh visual layout.",
    liveLink: "https://www.ik.aanks.xyz/",
    githubLink: "https://github.com/Ankesh-Singh/interviewkickstart",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/ik.png",
    tags: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Linear Scroll"
    ],
    category: "Frontend"
  },
  {
    id: "t7chat",
    title: "t7chat",
    description: "Simple dashboard to track AI conversations, inspect responses, and spot errors in real time.",
    longDescription:
      "Plugs into your AI apps to monitor prompt requests, stream answers smoothly, and strip private user data before logging everything to a clean analytics screen.",
    liveLink: "t7chat.aanks.xyz",
    githubLink: "https://github.com/Ankesh-Singh/t7.chat",
    video: "",
    image: "https://pub-72ca9ef0030f480aa75401c2a9dd00d3.r2.dev/chat.png",
    tags: [
      "Next.js 14",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "TailwindCSS",
      "Groq API",
      "LLM Observability",
      "Docker",
      "Vercel"
    ],
    category: "Fullstack"
  },
  {
    id: "cluster",
    title: "Cluster",
    description: "Lightweight project board to organize tasks and drag cards between columns.",
    longDescription:
      "A snappy Kanban task manager with smooth drag-and-drop boards, quick card editing, and automatic browser saving so your workflow stays organized.",
    liveLink: "https://www.cluster.aanks.xyz/",
    githubLink: "https://github.com/Ankesh-Singh/Cluster",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/cluster.png",
    tags: ["Next.js", "React Context API", "useReducer", "Framer Motion", "GSAP", "Tailwind CSS", "Lenis Scroll", "magicUI"],
    category: "Fullstack"
  },

  {
    id: "storerate",
    title: "StoreRate",
    description: "Local business review platform where shoppers share honest feedback and discover stores.",
    longDescription:
      "Find nearby neighborhood spots, read authentic reviews from fellow customers, and leave your own star ratings and feedback to help others shop local.",
    liveLink: "https://store-rate.vercel.app/",
    githubLink: "https://github.com/Ankesh-Singh/StoreRate",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/storerate.png",
    tags: ["Next.js 16", "React", "TypeScript", "Tailwind CSS", "shadcn/ui", "Framer Motion", "PostgreSQL", "Prisma", "JWT Authentication"],
    category: "Fullstack"
  },

];

export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id)
}

export const getAllProjects = (): Project[] => {
  return projects
}
