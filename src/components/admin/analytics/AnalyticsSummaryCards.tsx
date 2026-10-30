'use client';

import { Eye, Users, FileText, MapPin } from 'lucide-react';

interface SummaryProps {
  totalVisits: number;
  totalUniques: number;
  totalPageViews: number;
  topCountry: string;
  rangeLabel: string;
}

export default function AnalyticsSummaryCards({
  totalVisits,
  totalUniques,
  totalPageViews,
  topCountry,
  rangeLabel,
}: SummaryProps) {
  const cards = [
    {
      title: 'Total Requests',
      value: totalVisits.toLocaleString(),
      subtext: `Edge requests in ${rangeLabel.toLowerCase()}`,
      icon: Eye,
      color: 'text-blue-500 dark:text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Unique Visitors',
      value: totalUniques.toLocaleString(),
      subtext: `Distinct visitors in ${rangeLabel.toLowerCase()}`,
      icon: Users,
      color: 'text-emerald-500 dark:text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Page Views',
      value: totalPageViews.toLocaleString(),
      subtext: `HTML pages served in ${rangeLabel.toLowerCase()}`,
      icon: FileText,
      color: 'text-purple-500 dark:text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'Top Country',
      value: topCountry === 'unknown' || !topCountry ? 'Unknown' : topCountry.toUpperCase(),
      subtext: `Highest traffic origin`,
      icon: MapPin,
      color: 'text-amber-500 dark:text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.title}
            className="bg-white dark:bg-zinc-900/90 border border-neutral-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:border-neutral-300 dark:hover:border-zinc-700 transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-zinc-400">
                {c.title}
              </span>
              <div className={`p-2 rounded-lg border ${c.bg}`}>
                <Icon size={18} className={c.color} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight truncate">
                {c.value}
              </div>
              <p className="text-xs text-neutral-400 dark:text-zinc-500 mt-1">{c.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
