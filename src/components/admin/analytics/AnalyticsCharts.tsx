'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from 'recharts';

interface DailyItem {
  date: string;
  visits: number;
  clicks: number;
}

interface AnalyticsChartsProps {
  daily: DailyItem[];
  countries: Array<{ country: string; count: number }>;
  referrers: Array<{ referrer: string; count: number }>;
  topPages: Array<{ path: string; count: number }>;
}

const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States',
  IN: 'India',
  GB: 'United Kingdom',
  CA: 'Canada',
  DE: 'Germany',
  FR: 'France',
  JP: 'Japan',
  AU: 'Australia',
  BR: 'Brazil',
  RU: 'Russia',
  CN: 'China',
  SG: 'Singapore',
  NL: 'Netherlands',
  ES: 'Spain',
  IT: 'Italy',
  SE: 'Sweden',
  CH: 'Switzerland',
  ZA: 'South Africa',
  KR: 'South Korea',
  AE: 'United Arab Emirates',
  HK: 'Hong Kong',
  IE: 'Ireland',
  NZ: 'New Zealand',
  UA: 'Ukraine',
  PK: 'Pakistan',
  BD: 'Bangladesh',
  NP: 'Nepal',
};

function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.toLowerCase() === 'unknown' || countryCode.length !== 2) {
    return '🏳️';
  }
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  try {
    return String.fromCodePoint(...codePoints);
  } catch {
    return '🏳️';
  }
}

function getReferrerLogo(referrer: string): string {
  const ref = referrer.toLowerCase();
  if (ref.includes('x') || ref.includes('twitter')) return '/logo/x-company-solid.svg';
  if (ref.includes('google')) return '/logo/google.svg';
  if (ref.includes('substack')) return '/logo/substack-icon.svg';
  if (ref.includes('github')) return '/logo/github.svg';
  if (ref.includes('linkedin')) return '/logo/linkedin.svg';
  if (ref.includes('instagram')) return '/logo/instagram.svg';
  if (ref.includes('facebook')) return '/logo/facebook.svg';
  if (ref.includes('discord')) return '/logo/discord.svg';
  if (ref.includes('telegram')) return '/logo/telegram.svg';
  if (ref.includes('medium')) return '/logo/medium.svg';
  if (ref.includes('reddit')) return '/logo/reddit-icon.svg';
  if (ref.includes('whatsapp')) return '/logo/whatsapp-icon.svg';
  if (ref.includes('youtube')) return '/logo/youtube-icon.svg';
  return '/logo/hyperlink-linked-icon.svg';
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 p-2.5 rounded-lg shadow-lg text-xs">
        <p className="font-semibold text-neutral-500 dark:text-zinc-400 mb-1">{label}</p>
        {payload.map((item, index) => (
          <p key={index} className="font-mono flex items-center gap-1.5 mt-0.5">
            <span 
              className="w-1.5 h-1.5 rounded-full inline-block" 
              style={{ backgroundColor: item.color }} 
            />
            <span className="text-neutral-600 dark:text-zinc-300 capitalize">{item.name}:</span>
            <span className="font-bold text-neutral-900 dark:text-white ml-auto sm:ml-0">{item.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsCharts({
  daily,
  countries,
  referrers,
  topPages,
}: AnalyticsChartsProps) {
  const totalReferrers = referrers.reduce((a, r) => a + (r.count || 0), 0);
  const totalVisits = countries.reduce((a, c) => a + (c.count || 0), 0);
  const totalPageViews = topPages.reduce((a, p) => a + (p.count || 0), 0);

  return (
    <div className="space-y-5">
      {/* ── ROW 1: Full daily bar chart ───────────────────────────────────────── */}
      <div className="bg-white dark:bg-zinc-900/90 rounded-xl border border-neutral-200 dark:border-zinc-800 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Daily Traffic Timeline</h3>
            <p className="text-xs text-neutral-500 dark:text-zinc-500 mt-0.5">Page visits vs content engagement over time</p>
          </div>
          <div className="flex gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-neutral-600 dark:text-zinc-400">
              <span className="inline-block w-3 h-1 rounded-full bg-blue-500" /> Visits
            </span>
            <span className="flex items-center gap-1.5 text-neutral-600 dark:text-zinc-400">
              <span className="inline-block w-3 h-1 rounded-full bg-emerald-500" /> Clicks
            </span>
          </div>
        </div>

        <div className="h-56 w-full">
          {daily.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daily} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barGap={2} barCategoryGap="30%">
                <defs>
                  <linearGradient id="barVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.5} />
                  </linearGradient>
                  <linearGradient id="barClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#065f46" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-zinc-800" vertical={false} />
                <XAxis
                  dataKey="date"
                  className="fill-neutral-500 dark:fill-zinc-400"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: string) => {
                    if (!v) return '';
                    const p = v.split('-');
                    return p.length >= 3 ? `${p[1]}/${p[2]}` : v;
                  }}
                />
                <YAxis className="fill-neutral-500 dark:fill-zinc-400" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'currentColor', className: 'text-neutral-100 dark:text-zinc-800/40', opacity: 0.3 }} />
                <Bar dataKey="visits" name="Visits" fill="url(#barVisits)" radius={[3, 3, 0, 0]} maxBarSize={18} />
                <Bar dataKey="clicks" name="Clicks" fill="url(#barClicks)" radius={[3, 3, 0, 0]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-neutral-500">
              No data in this timeframe.
            </div>
          )}
        </div>
      </div>

      {/* ── ROW 2: Referrers + Countries ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Referrers */}
        <div className="bg-white dark:bg-zinc-900/90 rounded-xl border border-neutral-200 dark:border-zinc-800 p-4 sm:p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-0.5">Top Referrers</h3>
          <p className="text-xs text-neutral-500 dark:text-zinc-500 mb-4">Traffic sources bringing readers to your site</p>

          {referrers.length > 0 ? (
            <div className="space-y-4">
              {referrers.slice(0, 10).map((r, i) => {
                const pct = totalReferrers > 0 ? (r.count / totalReferrers) * 100 : 0;
                const logoSrc = getReferrerLogo(r.referrer);
                const name = r.referrer === 'direct' ? 'Direct' : r.referrer.charAt(0).toUpperCase() + r.referrer.slice(1);
                
                return (
                  <div key={r.referrer || i} className="flex items-center gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-neutral-50 dark:bg-zinc-800 flex items-center justify-center border border-neutral-200/50 dark:border-zinc-700/50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logoSrc}
                        alt={name}
                        className="w-4 h-4 object-contain dark:invert"
                      />
                    </div>

                    <div className="flex-1 flex items-center justify-between gap-4 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-semibold text-neutral-800 dark:text-zinc-200 truncate">
                          {name}
                        </span>
                      </div>

                      <div className="hidden sm:block flex-1 max-w-[160px] h-1.5 bg-neutral-100 dark:bg-zinc-800 rounded-full overflow-hidden mx-2">
                        <div
                          className="h-full rounded-full transition-all duration-500 bg-blue-500"
                          style={{
                            width: `${Math.max(pct, 3)}%`,
                          }}
                        />
                      </div>

                      <div className="flex items-center gap-3 text-xs shrink-0 font-mono">
                        <span className="font-semibold text-neutral-900 dark:text-white">{r.count}</span>
                        <span className="text-neutral-400 dark:text-zinc-500 w-10 text-right">{pct.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-neutral-500 dark:text-zinc-500 py-8 text-center">No referrer data.</p>
          )}
        </div>

        {/* Countries — ranked list with flag emojis */}
        <div className="bg-white dark:bg-zinc-900/90 rounded-xl border border-neutral-200 dark:border-zinc-800 p-4 sm:p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-0.5">Top Countries</h3>
          <p className="text-xs text-neutral-500 dark:text-zinc-500 mb-4">Geographic distribution of your audience</p>

          {countries.length > 0 ? (
            <div className="space-y-3.5">
              {countries.slice(0, 10).map((c, i) => {
                const pct = totalVisits > 0 ? (c.count / totalVisits) * 100 : 0;
                const countryKey = c.country || (c as unknown as { name?: string }).name || 'Unknown';
                const code = countryKey.toUpperCase();
                const flag = getFlagEmoji(code);
                const name = COUNTRY_NAMES[code] || countryKey;
                return (
                  <div key={countryKey || i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-neutral-800 dark:text-zinc-200 font-medium min-w-0">
                        <span className="text-base select-none shrink-0">{flag}</span>
                        <span className="truncate">{name}</span>
                      </span>
                      <span className="text-neutral-500 dark:text-zinc-400 font-mono shrink-0 ml-2">
                        <strong className="text-neutral-900 dark:text-white font-semibold">{c.count}</strong>
                        <span className="text-neutral-400 dark:text-zinc-600 ml-1">({pct.toFixed(0)}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${Math.max(pct, 3)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-neutral-500 dark:text-zinc-500 py-8 text-center">No country data.</p>
          )}
        </div>
      </div>

      {/* ── ROW 3: Most visited pages ─────────────────────────────────────────── */}
      {topPages.length > 0 && (
        <div className="bg-white dark:bg-zinc-900/90 rounded-xl border border-neutral-200 dark:border-zinc-800 p-4 sm:p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-0.5">Most Visited Pages</h3>
          <p className="text-xs text-neutral-500 dark:text-zinc-500 mb-4">Route-level breakdown of traffic</p>

          <div className="space-y-3">
            {topPages.slice(0, 5).map((page, idx) => {
              const pct = totalPageViews > 0 ? Math.round((page.count / totalPageViews) * 100) : 0;
              return (
                <div key={page.path || idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-neutral-700 dark:text-zinc-300 truncate max-w-[65%]">
                      {page.path === '/' ? '/ (Home)' : page.path}
                    </span>
                    <span className="text-neutral-500 dark:text-zinc-400 tabular-nums shrink-0 ml-2 font-mono">
                      <strong className="text-neutral-900 dark:text-white">{page.count}</strong>
                      <span className="text-neutral-400 dark:text-zinc-600 ml-1">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-1 bg-neutral-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${Math.max(pct, 3)}%`, opacity: 0.85 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
