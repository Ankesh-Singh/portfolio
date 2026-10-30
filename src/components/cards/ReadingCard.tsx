"use client";

import Image from 'next/image';
import { getDefaultBanner } from '@/lib/posts';
import Link from 'next/link';

interface ReadingCardProps {
  id: number;
  title: string | null;
  banner_url: string | null;
  url: string | null;
  notes: string | null;
  note_images: string;
  clicks: number;
}

export default function ReadingCard({ id, title, banner_url, url, notes }: ReadingCardProps) {
  const banner = banner_url || getDefaultBanner('reading', id);

  const handleCardClick = () => {
    fetch(`/api/posts/${id}/click`, { method: 'POST' }).catch(console.error);
  };

  const hasNotes = Boolean(notes && notes.trim().length > 0);
  const targetUrl = hasNotes ? `/reading/${id}` : (url || '#');
  const isExternal = !hasNotes && Boolean(url);

  const Component = isExternal ? 'a' : Link;
  const componentProps = isExternal 
    ? { href: targetUrl, target: '_blank', rel: 'noopener noreferrer' } 
    : { href: targetUrl };

  return (
    <Component
      {...componentProps}
      onClick={handleCardClick}
      className="group flex overflow-hidden rounded-lg bg-neutral-100/50 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 hover:border-neutral-300 dark:hover:border-zinc-700 transition-colors h-[110px] sm:h-[120px]"
    >
      {/* Image — 60% width */}
      <div className="relative w-[60%] shrink-0 overflow-hidden bg-neutral-200 dark:bg-zinc-800">
        <Image
          src={banner}
          alt={title || 'Reading'}
          fill
          className="object-cover"
        />
      </div>

      {/* Title — remaining 40% */}
      <div className="flex-1 flex items-center px-4 py-3 min-w-0">
        <h3 className="text-sm sm:text-base font-medium text-neutral-800 dark:text-zinc-100 group-hover:text-neutral-600 dark:group-hover:text-zinc-300 transition-colors line-clamp-3 leading-snug">
          {title || 'Untitled Reading'}
        </h3>
      </div>
    </Component>
  );
}
