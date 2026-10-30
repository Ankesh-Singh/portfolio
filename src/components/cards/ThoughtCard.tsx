"use client";

interface ThoughtCardProps {
  id: number;
  index: number; // display number (1-based)
  notes: string | null;
  url: string | null;
}

export default function ThoughtCard({ id, index, notes, url }: ThoughtCardProps) {
  const handleClick = () => {
    if (!url) return;
    fetch(`/api/posts/${id}/click`, { method: 'POST' }).catch(console.error);
    window.open(url, '_blank');
  };


  const inner = (
    <div className="flex gap-3 items-start group/thought">
      <span
        className="shrink-0 mt-0.5 text-sm font-mono text-neutral-400 dark:text-neutral-500 tabular-nums w-5 text-right select-none"
        aria-hidden="true"
      >
        {index}.
      </span>
      <div className="flex-1 min-w-0">
        {notes ? (
          <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
            {notes}
          </p>
        ) : (
          <p className="text-sm text-neutral-400 italic">—</p>
        )}
      </div>
    </div>
  );

  if (url) {
    return (
      <button
        onClick={handleClick}
        className="w-full text-left rounded-lg px-2 py-1.5 -mx-2 transition-colors hover:bg-neutral-100 dark:hover:bg-white/5 cursor-pointer group"
      >
        {inner}
      </button>
    );
  }

  return (
    <div className="rounded-lg px-2 py-1.5 -mx-2">
      {inner}
    </div>
  );
}
