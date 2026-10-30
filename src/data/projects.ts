import { Project } from '@/types/project'

export const projects: Project[] = [
  {
    id: "reposense",
    title: "RepoSense",
    description: "Turn any GitHub repo into an interactive wiki you can chat with and explore in seconds.",
    longDescription:
      "RepoSense scans your GitHub repo to build a clear, interactive wiki for your code. Just ask questions in plain English to understand how everything works, with direct links to the exact lines of code.",
    liveLink: "https://reposense.aash7.xyz/",
    githubLink: "https://github.com/Ethan4582/reposense",
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
    id: "mediq",
    title: "MediQ",
    description: "AI assistant that reads messy medical records and checks for conflicting prescriptions.",
    longDescription:
      "Upload doctor notes or lab reports, even handwritten ones, and MediQ pulls out key details instantly. It double-checks medication conflicts and shows you exactly where each answer came from.",
    liveLink: "",
    githubLink: "https://github.com/Ethan4582/mediq",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/image.png",
    tags: [
      "FastAPI",
      "Next.js",
      "TypeScript",
      "LangGraph",
      "Mistral OCR",
      "Supabase",
      "Python",
      "Docker"
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
    githubLink: "https://github.com/Ethan4582/snip",
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
    githubLink: "https://github.com/Ethan4582/Blitzr",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/chess.png",
    tags: ["Next.js", "TailwindCSS", "Python", "FastAPI", "Socket.IO", "Supabase", "Chess.js", "TypeScript"],
    category: "Fullstack"
  },
  {
    id: "t7blocks",
    title: "T7BLOCKS",
    description: "Ready-to-use animated website sections you can drop into any React project.",
    longDescription:
      "A gallery of slick, production-ready UI blocks with smooth animations built right in. Copy the code or use the CLI command to drop eye-catching sections into your app in seconds.",
    liveLink: "https://t7blocks.xyz/gallery",
    githubLink: "https://github.com/Ethan4582/T7blocks",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/Screenshot%202026-05-26%20164056.png",
    tags: [
      "React",
      "Next.js",
      "TypeScript",
      "TailwindCSS",
      "GSAP",
      "Framer Motion",
      "CLI",
      "UI Library",
      "Cloudflare"
    ],
    category: "Fullstack"
  },
  {
    id: "linkedin-free-search",
    title: "LinkedIn Free Search",
    description: "Chrome extension that helps you find and connect with relevant people on LinkedIn without premium.",
    longDescription:
      "Auto-generates Google search shortcuts from company recommendations, filters profiles open to connections, and exports clean lists to Excel or CSV for hassle-free networking.",
    liveLink: "",
    githubLink: "https://github.com/Ethan4582/linkedin-extractor",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/Link_ext.png",
    tags: ["JavaScript", "Tailwind", "TypeScript", "Google Search Automation"],
    category: "Frontend"
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
    liveLink: "https://ik.aash7.xyz/",
    githubLink: "https://github.com/Ethan4582/interviewkickstart",
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
    liveLink: "https://t7chat.vercel.app/",
    githubLink: "https://github.com/Ethan4582/t7.chat",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/Screenshot%202026-05-26%20090334.png",
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
    id: "amber-films-studio",
    title: "Amber Films Studio",
    description: "Cinematic portfolio site showcasing film projects and client stories with dark moody visuals.",
    longDescription:
      "A film studio showcase featuring high-res video reels, behind-the-scenes projects, and client awards brought to life with smooth, theater-style scroll animations.",
    liveLink: "https://amber-media.vercel.app/",
    githubLink: "https://github.com/Ethan4582/Amber-Media",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/amber.png",
    tweetUrl: "https://x.com/SinghAshir65848/status/1952964446466302226",
    tags: ["Next.js", "GSAP", "Lenis Scroll", "Framer Motion", "TypeScript"],
    category: "Frontend"
  },
  {
    id: "callclarity",
    title: "CallClarity",
    description: "Landing page for an AI service that listens to customer calls and checks team quality.",
    longDescription:
      "Clean enterprise landing page highlighting automated call audits, script compliance checks, and customer sentiment analytics designed to turn visitors into booked demos.",
    liveLink: "https://callclarity.vercel.app/",
    githubLink: "https://github.com/Ethan4582/callclarity",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/callcalrity.png",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Node.js"],
    category: "Frontend"
  },
  {
    id: "t7labs-blog",
    title: "T7Labs Blog",
    description: "Design lab and blog sharing modern UI experiments, cool animations, and frontend tutorials.",
    longDescription:
      "A creative playground exploring creative coding, custom shaders, and slick website layouts with step-by-step guides explaining how each effect was built.",
    liveLink: "https://blog-t7labs.pages.dev/blog",
    githubLink: "https://github.com/Ethan4582/blog-t7labs",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/blog.png",
    tags: ["Next.js", "React", "Cloudflare", "GSAP", "Framer Motion", "Shaders"],
    category: "Frontend"
  },
  {
    id: "intellisaas",
    title: "Intellisaas",
    description: "All-in-one AI tool to write articles, generate pictures, and clean up images in one place.",
    longDescription:
      "A creative suite where you can draft blog posts, brainstorm catchy titles, generate custom graphics, remove photo backgrounds, and get instant resume reviews.",
    liveLink: "https://intelilsas.vercel.app/",
    githubLink: "https://github.com/Ethan4582/intellisaas/",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/intelsaas.png",
    tags: ["React.js", "Node.js", "PostgreSQL", "TailwindCSS", "Clerk", "Gemini", "Clipdrop API", "Cloudinary"],
    category: "Fullstack"
  },
  {
    id: "vibehouse",
    title: "VibeHouse",
    description: "Interactive visual collage website designed for browsing creative media and portfolio shots.",
    longDescription:
      "A collage-style portfolio layout with dynamic masonry grids, smooth momentum scrolling, and engaging hover effects that make visual work stand out.",
    liveLink: "https://vibe-house.vercel.app/",
    githubLink: "https://github.com/Ethan4582/vibehouse",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/vibehouse.png",
    tags: ["Next.js", "React", "Tailwind CSS", "Framer Motion", "GSAP", "Lenis"],
    category: "Frontend"
  },
  {
    id: "mindly-ai",
    title: "Mindly AI",
    description: "High-converting sales page template crafted for creators selling AI and tech courses.",
    longDescription:
      "An attractive course landing page with interactive syllabus previews, student reviews, and clear signup buttons built to turn curious learners into paying students.",
    liveLink: "https://mindly-one.vercel.app/",
    githubLink: "https://github.com/Ethan4582",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/mindly.png",
    tweetUrl: "https://x.com/SinghAshir65848/status/1955202685126492585",
    tags: ["Next.js", "React", "Tailwind CSS", "TypeScript", "Framer Motion", "Lenis Scroll", "magicUI"],
    category: "Frontend"
  },
  {
    id: "focustube",
    title: "FocusTube",
    description: "Chrome extension that strips away YouTube's rabbit holes so you only watch what you came for.",
    longDescription:
      "Blocks the homepage feed, removes distracting video sidebars, hides comments, and skips Shorts so you can search, learn, and close the tab without getting hooked.",
    liveLink: "",
    githubLink: "https://github.com/Ethan4582/FocusTube",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/FocusTube.png",
    tags: ["JavaScript", "Chrome Extension APIs", "Tailwind"],
    category: "Frontend"
  },
  {
    id: "buildersignal",
    title: "BuilderSignal",
    description: "Personal brand and portfolio template for indie hackers and startup founders to share lessons.",
    longDescription:
      "A sleek dark-mode portfolio to tell your founder story, showcase shipped products, and post raw insights about growing side projects into sustainable businesses.",
    liveLink: "https://builder-signalhq.vercel.app/",
    githubLink: "https://github.com/Ethan4582/BuilderSignal",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/buildersignal.png",
    tags: ["Next.js", "TypeScript", "React", "Tailwind CSS", "Framer Motion", "GSAP"],
    category: "Frontend"
  },
  {
    id: "astra",
    title: "Astra",
    description: "Clean, minimalist digital agency site with spacious typography and subtle transitions.",
    longDescription:
      "A modern agency template featuring generous whitespace, sharp editorial type, and fluid page transitions to let high-end client work speak for itself.",
    liveLink: "https://ast-ra.vercel.app/",
    githubLink: "https://github.com/Ethan4582/Astra",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/astra.png",
    tags: ["Next.js (App Router)", "React", "Tailwind CSS", "Framer Motion", "GSAP", "Lenis"],
    category: "Frontend"
  },
  {
    id: "ai-chatbot",
    title: "AI Chatbot",
    description: "Fast AI chat assistant powered by Gemini with conversation history and code styling.",
    longDescription:
      "Chat with an intelligent assistant that streams answers instantly, formats and highlights code snippets nicely, and lets you switch between past conversations anytime.",
    liveLink: "https://gemini-ai-chatbot-zeta-sepia.vercel.app",
    githubLink: "https://github.com/Ethan4582/Gemini-AI-Chatbot",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/chat.png",
    tags: ["Next.js", "TypeScript", "Gemini AI", "Shadcn UI", "TailwindCSS", "Redis", "Lucide React", "Framer Motion"],
    category: "Fullstack"
  },
  {
    id: "cluster",
    title: "Cluster",
    description: "Lightweight project board to organize tasks and drag cards between columns.",
    longDescription:
      "A snappy Kanban task manager with smooth drag-and-drop boards, quick card editing, and automatic browser saving so your workflow stays organized.",
    liveLink: "https://clusterflow.vercel.app/",
    githubLink: "https://github.com/Ethan4582/Cluster",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/cluster.png",
    tags: ["Next.js", "React Context API", "useReducer", "Framer Motion", "GSAP", "Tailwind CSS", "Lenis Scroll", "magicUI"],
    category: "Fullstack"
  },
  {
    id: "dream-house",
    title: "Dream House",
    description: "Real estate marketplace to search, list, buy, and rent homes in your city.",
    longDescription:
      "Browse homes with clear photos and neighborhood details, save your favorite listings, and message property owners directly to schedule a tour.",
    liveLink: "https://dreamhouse-iota.vercel.app/",
    githubLink: "https://github.com/Ethan4582/Dream-house",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/house.png",
    tags: ["Next.js (App Router)", "TypeScript", "PostgreSQL", "Prisma", "TailwindCSS", "JWT Authentication", "Framer Motion", "Lucide Icons", "Docker"],
    category: "Fullstack"
  },
  {
    id: "t7labs-demo",
    title: "T7Labs Demo",
    description: "Live playground testing interactive web effects, animations, and new UI concepts.",
    longDescription:
      "A companion playground for the T7Labs blog where you can interact directly with custom shaders, physics-based springs, and experimental web UI components.",
    liveLink: "https://t7labs-demo.pages.dev/",
    githubLink: "https://github.com/Ethan4582/demo-t7labs",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/demo.png",
    tags: ["Next.js", "React", "Cloudflare", "GSAP", "Framer Motion", "Shaders"],
    category: "Frontend"
  },
  {
    id: "multi-threaded-proxy-server",
    title: "Multi-Threaded Proxy Server",
    description: "Fast web proxy in C that caches pages to serve multiple users at the same time.",
    longDescription:
      "A multi-threaded network proxy that sits between your browser and the web, caching visited pages in memory so repeated requests load instantly without extra network hops.",
    liveLink: "",
    githubLink: "https://github.com/Ethan4582/Multi-Threaded-Proxy-Server",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/Mul.png",
    tags: ["C++", "POSIX Threads", "Semaphores", "Mutexes"],
    category: "Fullstack"
  },
  {
    id: "eldoraui",
    title: "EldoraUI",
    description: "Component library of stylish, copy-paste React widgets to build sites faster.",
    longDescription:
      "A collection of accessible, pre-styled React UI elements that you can customize freely and copy directly into your project to speed up frontend development.",
    liveLink: "https://eldora-ui.vercel.app/",
    githubLink: "https://github.com/Ethan4582/EldoraUI/tree/master",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/EldoraUI.png",
    tweetUrl: "",
    tags: ["Next.js", "React", "Tailwind CSS", "TypeScript", "Framer Motion"],
    category: "Frontend"
  },
  {
    id: "storerate",
    title: "StoreRate",
    description: "Local business review platform where shoppers share honest feedback and discover stores.",
    longDescription:
      "Find nearby neighborhood spots, read authentic reviews from fellow customers, and leave your own star ratings and feedback to help others shop local.",
    liveLink: "https://store-rate.vercel.app/",
    githubLink: "https://github.com/Ethan4582/StoreRate",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/storerate.png",
    tags: ["Next.js 16", "React", "TypeScript", "Tailwind CSS", "shadcn/ui", "Framer Motion", "PostgreSQL", "Prisma", "JWT Authentication"],
    category: "Fullstack"
  },
  {
    id: "cryptoplace",
    title: "CryptoPlace",
    description: "Live crypto tracker displaying current token prices, daily changes, and price charts.",
    longDescription:
      "Track live cryptocurrency markets at a glance with up-to-the-minute coin values, 24-hour gainers and losers, and simple price history graphs.",
    liveLink: "",
    githubLink: "https://github.com/Ethan4582/Crypto-tracker",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/crypto.png",
    tags: ["React", "Node.js", "Framer Motion", "CoinGecko API"],
    category: "Web3"
  },
  {
    id: "minimal-portfolio-template",
    title: "Minimal Portfolio Template",
    description: "Modern developer portfolio with smooth reveal animations and responsive mobile layouts.",
    longDescription:
      "A ready-to-use personal website template built with subtle text-reveal effects, project galleries, and social links to help designers and developers present their best work.",
    liveLink: "https://portfolio-rose-iota-29.vercel.app/",
    githubLink: "https://github.com/Ethan4582/portfolio",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/port.png",
    tags: ["Next.js", "React", "Tailwind CSS", "TypeScript", "Framer Motion", "GSAP", "Lenis Scroll"],
    category: "Frontend"
  },
  {
    id: "streamerzz",
    title: "Streamerzz",
    description: "Animated landing page showcasing software toolkits and creator overlays for streamers.",
    longDescription:
      "A lively promotional site with pricing tiers, fan testimonials, and dynamic animations designed to introduce game streamers to a suite of broadcast enhancement tools.",
    liveLink: "https://streamerzz-indol.vercel.app",
    githubLink: "https://github.com/Ethan4582/Streamerzz",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/streamzz.png",
    tags: ["React", "Vite", "TailwindCSS", "Framer Motion", "JavaScript"],
    category: "Frontend"
  },
  {
    id: "nike-landing-page",
    title: "Nike Landing Page",
    description: "Dynamic concept showcase featuring athletic footwear with bold imagery and animations.",
    longDescription:
      "A responsive Nike-inspired concept page highlighting featured shoe models with bold typography, smooth product transitions, and mobile-friendly layouts.",
    liveLink: "",
    githubLink: "https://github.com/Ethan4582/Nike_landing-Page",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/nike.png",
    tags: ["Next.js", "TypeScript", "Framer Motion", "TailwindCSS"],
    category: "Frontend"
  },
  {
    id: "skycast",
    title: "Skycast",
    description: "Clean weather forecast app that gives you accurate local forecasts and weather alerts.",
    longDescription:
      "Check current conditions, hourly forecasts, and weekly weather predictions with a minimal interface and animated weather icons tailored to current outdoor conditions.",
    liveLink: "https://skycast-lilac-tau.vercel.app/",
    githubLink: "https://github.com/Ethan4582/Skycast",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/weather.png",
    tags: ["Next.js", "TypeScript", "Framer Motion", "TailwindCSS", "Weather API"],
    category: "Frontend"
  },
  {
    id: "gotham-legends",
    title: "Gotham Legends",
    description: "Interactive 3D Batman character showcase you can spin and explore in your browser.",
    longDescription:
      "An immersive tribute site featuring 3D superhero models and hero animations rendered smoothly directly in WebGL without needing any extra plugins.",
    liveLink: "https://gotham-legends.vercel.app",
    githubLink: "https://github.com/Ethan4582/Gotham-Legends",
    video: "",
    image: "https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/image/batman.png",
    tags: ["React", "Three.js", "TailwindCSS"],
    category: "Frontend"
  }
];

export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id)
}

export const getAllProjects = (): Project[] => {
  return projects
}
