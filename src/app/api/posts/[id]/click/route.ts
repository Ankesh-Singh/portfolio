import { NextResponse } from 'next/server';
import { incrementClicks } from '@/lib/db';

export const runtime = 'edge';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = Number(id);
    
    await incrementClicks(postId);
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
