import { NextResponse } from 'next/server';
import { getPosts, createPost } from '@/lib/db';
import { cookies } from 'next/headers';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') as 'blog' | 'reading' | 'thought';
  const tag = searchParams.get('tag');
  const limitParam = searchParams.get('limit');
  const offsetParam = searchParams.get('offset');
  const pageParam = searchParams.get('page');

  if (!['blog', 'reading', 'thought'].includes(type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  const limit = limitParam ? parseInt(limitParam, 10) : undefined;
  let offset = offsetParam ? parseInt(offsetParam, 10) : undefined;

  if (pageParam && limit) {
    const pageNum = Math.max(0, parseInt(pageParam, 10) || 0);
    offset = pageNum * limit;
  }

  try {
    const posts = await getPosts(
      type,
      isNaN(Number(limit)) ? undefined : limit,
      tag || undefined,
      isNaN(Number(offset)) ? undefined : offset
    );
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Failed to fetch posts', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Parameters<typeof createPost>[0];
    const post = await createPost(body);
    return NextResponse.json(post);
  } catch (error) {
    console.error('Failed to create post', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
