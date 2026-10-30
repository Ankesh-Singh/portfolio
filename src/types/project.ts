export type ProjectTag = 'Fullstack' | 'Frontend' | 'Web3' | 'All';

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  video?: string;
  image?: string;
  liveLink?: string;
  githubLink?: string;
  tags: string[];
  category: string;
  date?: string;
  tweetUrl?: string;
  variationCount?: number;
}
