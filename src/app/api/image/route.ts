import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const R2_PUBLIC_URL = 'https://pub-9758b1e5cf4842b287daf6ca545a773f.r2.dev';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');

  if (!key) {
    return new NextResponse('Missing key', { status: 400 });
  }

  const imageUrl = `${R2_PUBLIC_URL}/${key}`;

  try {
    const r2Response = await fetch(imageUrl);

    if (!r2Response.ok) {
      return new NextResponse('Image not found', { status: r2Response.status });
    }

    const contentType = r2Response.headers.get('content-type') || 'image/jpeg';
    const imageData = await r2Response.arrayBuffer();

    return new NextResponse(imageData, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch {
    return new NextResponse('Failed to fetch image', { status: 500 });
  }
}
