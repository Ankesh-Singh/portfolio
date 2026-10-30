"use client";

import Image from 'next/image';

interface TwitterCardProps {
  id: number;
  url: string;
  notes: string | null;
  onClick: (e: React.MouseEvent) => void;
}

export default function TwitterCard({ url, notes, onClick }: TwitterCardProps) {
  return (
    <a 
      href={url} 
      onClick={onClick}
      className="block p-4 rounded-xl bg-black border border-zinc-800 hover:bg-zinc-900 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-zinc-800 shrink-0">
          <Image src="/profile.png" alt="Profile" fill className="object-cover" onError={(e) => { e.currentTarget.src = 'https://github.com/github.png' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-bold text-white truncate">Ash</span>
              <span className="text-zinc-500 text-sm truncate">@ash</span>
            </div>
            {/* Simple X Logo */}
            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-zinc-500 shrink-0">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
          {notes && (
            <p className="mt-1 text-[15px] text-white leading-normal whitespace-pre-wrap">
              {notes}
            </p>
          )}
          <div className="mt-3 text-sm text-blue-400 hover:underline">
            View on X →
          </div>
        </div>
      </div>
    </a>
  );
}
