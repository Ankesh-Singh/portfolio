import { NextResponse } from 'next/server';
import { deletePost, getPost, updatePost } from '@/lib/db';
import { cookies } from 'next/headers';
import { deleteFromR2, extractR2Key } from '@/lib/r2';

export const runtime = 'edge';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const postId = Number(id);

    const post = await getPost(postId);
    if (post) {
      if (post.banner_url) {
        const key = extractR2Key(post.banner_url);
        if (key) await deleteFromR2(key);
      }
      try {
        const noteImages: string[] = JSON.parse(post.note_images || '[]');
        for (const imgUrl of noteImages) {
          const key = extractR2Key(imgUrl);
          if (key) await deleteFromR2(key);
        }
      } catch {}
    }

    await deletePost(postId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete post', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json() as Parameters<typeof updatePost>[1];
    const post = await updatePost(Number(id), body);

    if (!post) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Failed to update post', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
