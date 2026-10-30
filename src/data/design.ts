import type { Design } from "@/types/design";

export const designs: Design[] = [
  /*
  {
    id: '1',
    title: 'Nomad Architects',
    description: 'Luxury architecture studio hero section',
    image: 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/design/arch1.png',
    category: 'Hero',
    variations: [
      {
        id: '2',
        title: 'Pietra Design Lab',
        description: 'Warm interior design landing page',
        image: 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/design/arch2.png',
        category: 'Hero'
      }
    ]
  },
  
  {
    id: '3',
    title: 'Pulse X',
    description: 'Bold brutalist fitness brand hero',
    image: 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/design/BRUTALISM_1.png',
    category: 'Hero',
    variations:[
      {
        id: '7',
        title: 'Breakout',
        description: 'Streetwear inspired bold homepage',
        image: 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/design/BRUTALISM_5.png',
        category: 'Hero'
      },
    ]
  },
  {
    id: '5',
    title: 'Nexora',
    description: 'Vibrant modern agency landing page',
    image: 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/design/brutalism_3.png',
    category: 'Hero',
    variations:[
      {
        id: '4',
        title: 'Vanta',
        description: 'Minimal monochrome portfolio hero',
        image: 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/design/BRUTALISM_2.png',
        category: 'Hero'
      },
    ]
  },
  {
    id: '6',
    title: 'Aura Collective',
    description: 'Dark cyber-aesthetic creative studio',
    image: 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/design/BRUTALISM_4.png',
    category: 'Hero',
  },
  {
    id: '8',
    title: 'HyperGrid Studio',
    description: 'High-contrast typography experimental agency',
    image: 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/design/BRUTALISM_6.png',
    category: 'Hero',
    variations: [
      {
        id: '12',
        title: 'Quantum Shift',
        description: 'Deep violet neon developer tool hero',
        image: 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/design/BRUTALISM_10.png',
        category: 'Hero'
      }
    ]
  },
  {
    id: '9',
    title: 'Prism Creative',
    description: 'Electric lime brutalist studio hero',
    image: 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/design/BRUTALISM_7.png',
    category: 'Hero',
    variations: [
      {
        id: '10',
        title: 'Nova Craft',
        description: 'Vibrant cyberpunk agency hero with bold grid',
        image: 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/design/BRUTALISM_8.png',
        category: 'Hero'
      }
    ]
  },
  {
    id: '11',
    title: 'Apex Vanguard',
    description: 'Gold-accented luxury brutalist landing page',
    image: 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/design/BRUTALISM_9.png',
    category: 'Hero',
    variations: [
      {
        id: '13',
        title: 'Zephyr Labs',
        description: 'Warm cream brutalist editorial hero section',
        image: 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/design/BRUTALISM_11.png',
        category: 'Hero'
      }
    ]
  },
  {
    id: '14',
    title: 'Minimal Sign-In',
    description: 'Clean split-screen authentication page with ambient glow',
    image: 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/design/signup_1.png',
    category: 'Sections',
    variations: [
      {
        id: '15',
        title: 'Glassmorphic Login',
        description: 'Frosted glass floating card sign-in form',
        image: 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/design/signup_2.png',
        category: 'Sections'
      }
    ]
  },
  {
    id: '16',
    title: 'Early Access Hub',
    description: 'Minimalist product launch waitlist with live count',
    image: 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/design/waitlist_1.png',
    category: 'Waitlist',
    variations: [
      {
        id: '17',
        title: 'The Future Awaits',
        description: 'Dark futuristic waitlist landing page',
        image: 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/design/waitlist_2.png',
        category: 'Waitlist',
      },
      {
        id: '18',
        title: 'Curiosity Leads Further',
        description: 'Neon gradient newsletter signup',
        image: 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/design/waitlist_3.png',
        category: 'Waitlist',
      }
    ]
  },
  */
];

export const getDesignById = (id: string): Design | undefined => {
  for (const design of designs) {
    if (design.id === id) return design;
    if (design.variations) {
      const variation = design.variations.find(v => v.id === id);
      if (variation) return variation;
    }
  }
  return undefined;
};

export const getAllDesigns = (): Design[] => {
  return designs;
};
