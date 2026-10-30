"use client";


interface SubstackCardProps {
  id: number;
  url: string;
  title: string | null;
  notes: string | null;
  onClick: (e: React.MouseEvent) => void;
}

export default function SubstackCard({ url, title, notes, onClick }: SubstackCardProps) {
  return (
    <a 
      href={url} 
      onClick={onClick}
      className="block p-5 rounded-xl bg-white border border-zinc-200 hover:border-zinc-300 transition-colors"
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {/* Substack Logo */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#FF6719] shrink-0">
              <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Substack</span>
          </div>
          {title && (
            <h3 className="font-bold text-black text-lg mb-1 leading-tight">
              {title}
            </h3>
          )}
          {notes && (
            <p className="text-zinc-600 text-sm leading-relaxed line-clamp-3 whitespace-pre-wrap">
              {notes}
            </p>
          )}
          <div className="mt-4 text-sm font-medium text-[#FF6719] hover:underline">
            Read on Substack →
          </div>
        </div>
      </div>
    </a>
  );
}
