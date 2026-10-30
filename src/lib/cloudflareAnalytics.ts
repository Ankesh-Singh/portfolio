import { getRequestContext } from "@cloudflare/next-on-pages";

export interface AnalyticsSummary {
  totalVisits: number;
  totalUniques: number;
  totalPageViews: number;
  topCountry: string;
}

export interface DailyAnalyticsPoint {
  date: string;
  visits: number;
  pageViews: number;
  uniques: number;
}

export interface TopItem {
  name: string;
  count: number;
}

export interface CloudflareAnalyticsResult {
  summary: AnalyticsSummary;
  timeline: DailyAnalyticsPoint[];
  topCountries: TopItem[];
  topPages: TopItem[];
}

interface CacheEntry {
  timestamp: number;
  data: CloudflareAnalyticsResult;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const memoryCache: Record<string, CacheEntry> = {};

export interface AnalyticsQueryParams {
  range?: string; // '30m' | '1h' | '6h' | '12h' | '24h' | '7d' | '30d' | '90d' | 'all' | 'custom'
  startDate?: string;
  endDate?: string;
}

function resolveTimeWindow(params: AnalyticsQueryParams): { isSubDaily: boolean; startIso: string; endIso: string; startDate: string; endDate: string } {
  const now = Date.now();
  const range = params.range || '30d';

  if (range === 'custom' && params.startDate && params.endDate) {
    const s = new Date(params.startDate).getTime();
    const e = new Date(params.endDate).getTime();
    const diffHours = Math.max(1, (e - s) / (1000 * 60 * 60));
    const isSubDaily = diffHours <= 24;
    return {
      isSubDaily,
      startIso: new Date(s).toISOString(),
      endIso: new Date(e).toISOString(),
      startDate: new Date(s).toISOString().split('T')[0],
      endDate: new Date(e).toISOString().split('T')[0],
    };
  }

  const hoursMap: Record<string, number> = {
    '30m': 0.5,
    '1h': 1,
    '6h': 6,
    '12h': 12,
    '24h': 24,
    '7d': 7 * 24,
    '30d': 30 * 24,
    '90d': 90 * 24,
    'all': 365 * 24,
  };

  const hours = hoursMap[range] || 30 * 24;
  const isSubDaily = hours <= 24;
  const startMs = now - hours * 60 * 60 * 1000;

  return {
    isSubDaily,
    startIso: new Date(startMs).toISOString(),
    endIso: new Date(now).toISOString(),
    startDate: new Date(startMs).toISOString().split('T')[0],
    endDate: new Date(now).toISOString().split('T')[0],
  };
}

export async function fetchCloudflareAnalytics(params: AnalyticsQueryParams = { range: '30d' }): Promise<CloudflareAnalyticsResult> {
  const window = resolveTimeWindow(params);
  const cacheKey = `cf_analytics_${params.range || '30d'}_${window.startIso}_${window.endIso}`;
  const now = Date.now();

  if (memoryCache[cacheKey] && now - memoryCache[cacheKey].timestamp < CACHE_TTL_MS) {
    return memoryCache[cacheKey].data;
  }

  let apiToken = process.env.CLOUDFLARE_API_TOKEN;
  let zoneId = process.env.CLOUDFLARE_ZONE_ID || 'dc062fee89a9757eb58f4e1791805bff';

  try {
    const ctx = getRequestContext();
    const env = ctx?.env;
    if (env && typeof env === 'object') {
      if ('CLOUDFLARE_API_TOKEN' in env && env.CLOUDFLARE_API_TOKEN) {
        apiToken = env.CLOUDFLARE_API_TOKEN as string;
      }
      if ('CLOUDFLARE_ZONE_ID' in env && env.CLOUDFLARE_ZONE_ID) {
        zoneId = env.CLOUDFLARE_ZONE_ID as string;
      }
    }
  } catch {}

  if (!apiToken) {
    console.warn('Missing CLOUDFLARE_API_TOKEN, returning fallback analytics.');
    return getFallbackAnalytics();
  }

  const adaptiveSince = new Date(now - 23 * 60 * 60 * 1000).toISOString();

  let query = '';
  let variables: Record<string, unknown> = {};

  if (window.isSubDaily) {
    query = `
      query GetSubDaily($zoneId: String!, $since: String!, $until: String!) {
        viewer {
          zones(filter: { zoneTag: $zoneId }) {
            timeline: httpRequestsAdaptiveGroups(
              limit: 60,
              filter: { datetime_geq: $since, datetime_leq: $until }
              orderBy: [datetime_ASC]
            ) {
              count
              dimensions {
                datetime
              }
            }
            countries: httpRequestsAdaptiveGroups(
              limit: 10,
              filter: { datetime_geq: $since, datetime_leq: $until }
              orderBy: [count_DESC]
            ) {
              count
              dimensions {
                clientCountryName
              }
            }
            paths: httpRequestsAdaptiveGroups(
              limit: 10,
              filter: { datetime_geq: $since, datetime_leq: $until }
              orderBy: [count_DESC]
            ) {
              count
              dimensions {
                clientRequestPath
              }
            }
          }
        }
      }
    `;
    variables = { zoneId, since: window.startIso, until: window.endIso };
  } else {
    query = `
      query GetDaily($zoneId: String!, $dateGeq: String!, $dateLeq: String!, $adaptiveSince: String!) {
        viewer {
          zones(filter: { zoneTag: $zoneId }) {
            timeline: httpRequests1dGroups(
              limit: 100,
              filter: { date_geq: $dateGeq, date_leq: $dateLeq }
              orderBy: [date_ASC]
            ) {
              dimensions {
                date
              }
              sum {
                requests
                pageViews
                bytes
              }
              uniq {
                uniques
              }
            }
            countries: httpRequestsAdaptiveGroups(
              limit: 10,
              filter: { datetime_gt: $adaptiveSince }
              orderBy: [count_DESC]
            ) {
              count
              dimensions {
                clientCountryName
              }
            }
            paths: httpRequestsAdaptiveGroups(
              limit: 10,
              filter: { datetime_gt: $adaptiveSince }
              orderBy: [count_DESC]
            ) {
              count
              dimensions {
                clientRequestPath
              }
            }
          }
        }
      }
    `;
    variables = { zoneId, dateGeq: window.startDate, dateLeq: window.endDate, adaptiveSince };
  }

  try {
    const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Cloudflare GraphQL API error: ${response.statusText}`);
    }

    const json = (await response.json()) as {
      data?: {
        viewer?: {
          zones?: Array<{
            timeline?: Array<{
              count?: number;
              dimensions: { date?: string; datetime?: string };
              sum?: { requests?: number; pageViews?: number; bytes?: number };
              uniq?: { uniques?: number };
            }>;
            countries?: Array<{
              count: number;
              dimensions: { clientCountryName?: string };
            }>;
            paths?: Array<{
              count: number;
              dimensions: { clientRequestPath?: string };
            }>;
          }>;
        };
      };
      errors?: Array<{ message: string }>;
    };

    if (json.errors && json.errors.length > 0) {
      throw new Error(`Cloudflare GraphQL Error: ${json.errors[0].message}`);
    }

    const zoneData = json.data?.viewer?.zones?.[0];
    const rawTimeline = zoneData?.timeline || [];
    const rawCountries = zoneData?.countries || [];
    const rawPaths = zoneData?.paths || [];

    let totalVisits = 0;
    let totalUniques = 0;
    let totalPageViews = 0;

    const timeline: DailyAnalyticsPoint[] = rawTimeline.map((item) => {
      const pointDate = item.dimensions.datetime
        ? item.dimensions.datetime.slice(11, 16) // HH:mm for sub-daily
        : item.dimensions.date || '';

      const visits = item.sum?.requests ?? item.count ?? 0;
      const pageViews = item.sum?.pageViews ?? Math.round(visits * 0.85);
      const uniques = item.uniq?.uniques ?? Math.round(visits * 0.7);

      totalVisits += visits;
      totalPageViews += pageViews;
      totalUniques += uniques;

      return {
        date: pointDate,
        visits,
        pageViews,
        uniques,
      };
    });

    const topCountries: TopItem[] = rawCountries.map((c) => ({
      name: c.dimensions.clientCountryName || 'Unknown',
      count: c.count,
    }));

    const topPages: TopItem[] = rawPaths
      .filter((p) => p.dimensions.clientRequestPath && !p.dimensions.clientRequestPath.includes('.'))
      .slice(0, 10)
      .map((p) => ({
        name: p.dimensions.clientRequestPath || '/',
        count: p.count,
      }));

    const topCountry = topCountries.length > 0 ? topCountries[0].name : 'US';

    const result: CloudflareAnalyticsResult = {
      summary: {
        totalVisits,
        totalUniques: window.isSubDaily ? Math.round(totalVisits * 0.75) : totalUniques,
        totalPageViews,
        topCountry,
      },
      timeline,
      topCountries,
      topPages,
    };

    memoryCache[cacheKey] = { timestamp: now, data: result };
    return result;
  } catch (error) {
    console.error('Error fetching Cloudflare Analytics:', error);
    return getFallbackAnalytics();
  }
}

function getFallbackAnalytics(): CloudflareAnalyticsResult {
  return {
    summary: { totalVisits: 0, totalUniques: 0, totalPageViews: 0, topCountry: 'US' },
    timeline: [],
    topCountries: [],
    topPages: [],
  };
}
