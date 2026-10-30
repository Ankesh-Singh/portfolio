'use client';

import { useState } from 'react';
import { BookOpen, Newspaper, Sparkles, ExternalLink, MousePointer } from 'lucide-react';
import Link from 'next/link';

interface PostItem {
  id: number;
  title?: string | null;
  notes?: string | null;
  url?: string | null;
  clicks: number;
  created_at: string;
}

interface ContentPerformanceProps {
  topBlogs: PostItem[];
  topReadings: PostItem[];
  topThoughts: PostItem[];
}

export default function ContentPerformance({
  topBlogs,
  topReadings,
  topThoughts,
}: ContentPerformanceProps) {
  const [activeTab, setActiveTab] = useState<'reading' | 'blog' | 'thought'>('reading');

  const totalBlogClicks = topBlogs.reduce((acc, b) => acc + (b.clicks || 0), 0);
  const totalReadingClicks = topReadings.reduce((acc, r) => acc + (r.clicks || 0), 0);
  const totalThoughtClicks = topThoughts.reduce((acc, t) => acc + (t.clicks || 0), 0);

  const maxClicks = Math.max(
    ...(activeTab === 'reading'
      ? topReadings.map((r) => r.clicks || 0)
      : activeTab === 'blog'
      ? topBlogs.map((b) => b.clicks || 0)
      : topThoughts.map((t) => t.clicks || 0)),
    1
  );

  const currentList = (
    activeTab === 'reading' ? topReadings : activeTab === 'blog' ? topBlogs : topThoughts
  ).slice(0, 5);

  return (
    <div className="bg-white dark:bg-zinc-900/90 p-6 rounded-xl border border-neutral-200 dark:border-zinc-800 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-zinc-800/80 pb-4">
        <div>
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">Content Performance & Click Ranking</h3>
          <p className="text-xs text-neutral-500 dark:text-zinc-500 mt-0.5">
            Identify which articles, readings, and thoughts are generating the most engagement
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-neutral-50 dark:bg-zinc-950 p-1 rounded-lg border border-neutral-200 dark:border-zinc-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('reading')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'reading'
                ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
                : 'text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <BookOpen size={14} /> Readings ({totalReadingClicks})
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'blog'
                ? 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30'
                : 'text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Newspaper size={14} /> Blogs ({totalBlogClicks})
          </button>
          <button
            onClick={() => setActiveTab('thought')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'thought'
                ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30'
                : 'text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Sparkles size={14} /> Thoughts ({totalThoughtClicks})
          </button>
        </div>
      </div>

      {/* Ranked Content List */}
      <div className="space-y-3">
        {currentList.length > 0 ? (
          currentList.map((item, idx) => {
            const clicks = item.clicks || 0;
            const pct = Math.round((clicks / maxClicks) * 100);

            return (
              <div
                key={item.id}
                className="p-4 bg-neutral-50/50 dark:bg-zinc-950/70 rounded-lg border border-neutral-200/60 dark:border-zinc-800/80 hover:border-neutral-300 dark:hover:border-zinc-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {/* Rank Badge */}
                  <span
                    className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-bold ${
                      idx === 0
                        ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40'
                        : idx === 1
                        ? 'bg-neutral-100 dark:bg-zinc-300/20 text-neutral-750 dark:text-zinc-200 border border-neutral-200 dark:border-zinc-400/40'
                        : idx === 2
                        ? 'bg-amber-100/50 dark:bg-amber-700/20 text-amber-800 dark:text-amber-400 border border-amber-200/50 dark:border-amber-700/40'
                        : 'bg-neutral-100 dark:bg-zinc-800 text-neutral-500 dark:text-zinc-400'
                    }`}
                  >
                    {idx + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                        {item.title || item.notes || 'Untitled Item'}
                      </h4>

                      {activeTab === 'reading' && (
                        <Link
                          href={`/reading/${item.id}`}
                          target="_blank"
                          className="text-neutral-400 hover:text-emerald-600 dark:text-zinc-500 dark:hover:text-emerald-400 transition-colors"
                          title="View reading page"
                        >
                          <ExternalLink size={13} />
                        </Link>
                      )}

                      {activeTab === 'blog' && item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-400 hover:text-blue-600 dark:text-zinc-500 dark:hover:text-blue-400 transition-colors"
                          title="Open blog link"
                        >
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-neutral-400 dark:text-zinc-500 mt-1">
                      <span>Published {item.created_at}</span>
                      {item.url && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[200px] text-neutral-500 dark:text-zinc-400 font-mono text-[11px]">
                            {item.url}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Click stats & progress bar */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0 min-w-[130px]">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-zinc-300">
                    <MousePointer size={13} className="text-neutral-400 dark:text-zinc-500" />
                    <span className="font-mono font-semibold text-neutral-900 dark:text-white tabular-nums text-sm">
                      {clicks.toLocaleString()}
                    </span>
                    <span className="text-neutral-400 dark:text-zinc-500 text-[11px]">clicks</span>
                  </div>

                  <div className="w-24 sm:w-28 h-1.5 bg-neutral-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        activeTab === 'reading'
                          ? 'bg-emerald-500'
                          : activeTab === 'blog'
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.max(pct, 6)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-neutral-500 dark:text-zinc-500 py-6 text-center">
            No {activeTab}s found in database.
          </p>
        )}
      </div>
    </div>
  );
}
