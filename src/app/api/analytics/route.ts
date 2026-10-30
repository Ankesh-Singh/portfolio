import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { fetchCloudflareAnalytics } from '@/lib/cloudflareAnalytics';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '30d';
  const startDate = searchParams.get('startDate') || searchParams.get('start') || undefined;
  const endDate = searchParams.get('endDate') || searchParams.get('end') || undefined;

  try {
    const data = await fetchCloudflareAnalytics({
      range,
      startDate,
      endDate,
    });

    return NextResponse.json({
      range,
      startDate,
      endDate,
      summary: {
        totalVisits: data.summary.totalVisits,
        totalUniques: data.summary.totalUniques,
        totalPageViews: data.summary.totalPageViews,
        topCountry: data.summary.topCountry,
      },
      daily: data.timeline,
      countries: data.topCountries.map((c) => ({ country: c.name, count: c.count })),
      topPages: data.topPages.map((p) => ({ path: p.name, count: p.count })),
    });
  } catch (error) {
    console.error('Failed to fetch Cloudflare Analytics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
