'use client';

import { useEffect, useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import AnalyticsSummaryCards from './analytics/AnalyticsSummaryCards';
import AnalyticsCharts from './analytics/AnalyticsCharts';
import { DateRangeValue } from './analytics/types';

interface AnalyticsResponse {
  range: string;
  startDate?: string;
  endDate?: string;
  summary: {
    totalVisits: number;
    totalUniques: number;
    totalPageViews: number;
    topCountry: string;
  };
  daily: Array<{ date: string; visits: number; clicks?: number; pageViews: number; uniques: number }>;
  countries: Array<{ country: string; count: number }>;
  topPages: Array<{ path: string; count: number }>;
  error?: string;
}

export default function Analytics({ rangeValue }: { rangeValue: DateRangeValue }) {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async (rv: DateRangeValue) => {
    setLoading(true);

    try {
      let url = '/api/analytics';
      if (rv.type === 'preset' && rv.preset) {
        url += `?range=${rv.preset}`;
      } else if (rv.type === 'custom' && rv.startDate && rv.endDate) {
        url += `?range=custom&start=${encodeURIComponent(rv.startDate)}&end=${encodeURIComponent(rv.endDate)}`;
      } else {
        url += `?range=30d`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch analytics');
      const json = (await res.json()) as AnalyticsResponse;
      setData(json);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(rangeValue);
  }, [rangeValue, fetchAnalytics]);

  if (loading && !data) {
    return (
      <div className="py-20 text-center text-neutral-500 dark:text-zinc-400 flex flex-col items-center justify-center gap-3">
        <RefreshCw size={24} className="animate-spin text-blue-500" />
        <p className="text-sm">Loading Cloudflare analytics data...</p>
      </div>
    );
  }

  if (!data || data.error) {
    return (
      <div className="py-16 text-center text-red-500 dark:text-red-400 bg-white dark:bg-zinc-900/50 border border-neutral-200 dark:border-zinc-800 rounded-xl p-8 shadow-sm">
        <p className="font-semibold mb-2">Failed to load analytics</p>
        <p className="text-xs text-neutral-400 dark:text-zinc-500 mb-4">Please check CLOUDFLARE_API_TOKEN and CLOUDFLARE_ZONE_ID settings.</p>
        <button
          onClick={() => fetchAnalytics(rangeValue)}
          className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-neutral-900 dark:text-white text-xs font-medium rounded-lg transition-colors border border-neutral-200 dark:border-zinc-700 cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <AnalyticsSummaryCards
        totalVisits={data.summary.totalVisits}
        totalUniques={data.summary.totalUniques}
        totalPageViews={data.summary.totalPageViews}
        topCountry={data.summary.topCountry}
        rangeLabel={rangeValue.label}
      />

      {/* Main Charts & Breakdowns */}
      <AnalyticsCharts
        daily={data.daily.map((d) => ({ ...d, clicks: d.clicks || 0 }))}
        countries={data.countries}
        referrers={[]}
        topPages={data.topPages}
      />
    </div>
  );
}
