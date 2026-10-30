export type PostType = 'blog' | 'reading' | 'thought';
export type ReadingTag = 'tech' | 'non-tech';

export interface Post {
  id: number;
  type: PostType;
  tag?: string | null;
  title: string | null;
  url: string | null;
  banner_url: string | null;
  notes: string | null;
  note_images: string;
  clicks: number;
  created_at: string;
}

export function getDefaultBanner(type: PostType, id: number) {
  const randomNum = (id % 7) + 1;
  return `/defaults/${randomNum}.png`;
}
