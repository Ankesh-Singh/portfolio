import { BlogPost } from '@/types/blog'

export const blogs: BlogPost[] = [
  {
    id: 'elon-musk-tweets',
    title: 'Elon Musk Tweets 200 Million Phones Explode With Notifications. Here\'s How',
    readTime: '30 min read',
    externalUrl: 'https://x.com/ashirwadsingh_/status/2067609228261396936'
  },
  {
    id: 'aash7-417206',
    title: '3.6 Billion Daily Plays. One Real-Time Leaderboard.  Here\'s How (Most Get It Wrong)',
    readTime: '15 min read',
    externalUrl: 'https://x.com/ashirwadsingh_/status/2065673693922238680'
  },
  {
    id: 'tts-system',
    title: 'High-Performance 3D Infinite Gallery with Three.js and GSAP',
    readTime: '15 min read',
    externalUrl: 'https://blog-t7labs.pages.dev/blog/gsap/infinite-3d-gallery'
  },
  {
    id: 'problem-solving',
    title: 'GSAP ScrollTrigger Stacked Sections with Smooth Transitions',
    readTime: '8 min read',
    externalUrl: 'https://blog-t7labs.pages.dev/blog/gsap/sticky-scroll'
  },
  {
    id: 'ssh-server-guide',
    title: 'Scroll-Driven Motion Gallery with Hover Video Previews',
    readTime: '5 min read',
    externalUrl: 'https://blog-t7labs.pages.dev/blog/scroll-animation/scroll-motion-gallery'
  },
  {
    id: 'rag',
    title: 'Interactive Water Ripple Text Effect Using Three.js Shaders',
    readTime: '12 min read',
    externalUrl: 'https://blog-t7labs.pages.dev/blog/misc/water-ripple-hover-effect'
  }
]

export const getBlogById = (id: string): BlogPost | undefined => {
  return blogs.find(blog => blog.id === id)
}
