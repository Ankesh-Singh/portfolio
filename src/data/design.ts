import type { Design } from "@/types/design";


export const designs: Design[] = [
   
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
  }, {
    id: '6',
    title: 'Solvyn',
    description: 'Corporate brutalist architecture hero',
    image: 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/design/BRUTALISM_4.png',
    category: 'Hero'
  },
    ],
  },
 
  {
    id: '8',
    title: 'Read More',
    description: 'Editorial fashion magazine layout',
    image: 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/design/BRUTALISM_6.png',
    category: 'Sections',
    variations: [
      {
        id: '12',
        title: 'Think Less',
        description: 'Dark rebellious fashion landing page',
        image: 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/design/BRUTALISM_10.png',
        category: 'Sections'
      },
    ],
  },
  {
    id: '9',
    title: 'Unbound',
    description: 'High fashion monochrome showcase',
    image: 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/design/BRUTALISM_7.png',
    category: 'Hero',
    variations: [
      {
        id: '10',
        title: 'Outsiders',
        description: 'Modern luxury fashion campaign',
        image: 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/design/BRUTALISM_8.png',
        category: 'Hero'
      },
    ],
  },
  {
    id: '11',
    title: 'Loners',
    description: 'Minimal editorial fashion concept',
    image: 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/design/BRUTALISM_9.png',
    category: 'Hero',
    variations: [
      {
        id: '13',
        title: 'Rebellion',
        description: 'Underground streetwear hero section',
        image: 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/design/BRUTALISM_11.png',
        category: 'Hero'
      },
    ],
  },
 
  
  {
    id: '14',
    title: 'Verdant',
    description: 'Eco themed modern signup page',
    image: 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/design/signup_1.png',
    category: 'Sections',
    variations:[
       {
    id: '15',
    title: 'Elevate',
    description: 'Glassmorphism SaaS signup screen',
    image: 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/design/signup_2.png',
    category: 'Sections'
  },
  
    ]
  },

  {
    id: '16',
    title: 'Timeless Ideas',
    description: 'Elegant newsletter waitlist section',
    image: 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev/design/waitlist_1.png',
    category: 'Waitlist',
    variations:[
 {
    id: '17',
    title: 'Stories That Inspire',
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
 
]

export const getDesignById = (id: string): Design | undefined => {
  for (const design of designs) {
    if (design.id === id) return design;
    if (design.variations) {
      const variation = design.variations.find(v => v.id === id);
      if (variation) return variation;
    }
  }
  return undefined;
}

export const getAllDesigns = (): Design[] => {
  return designs
}