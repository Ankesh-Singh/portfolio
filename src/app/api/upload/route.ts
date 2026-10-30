import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { uploadToR2 } from '@/lib/r2';

export const runtime = 'edge';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type');
    
    if (!(file instanceof File) || typeof type !== 'string') {
      return NextResponse.json({ error: 'Missing file or type' }, { status: 400 });
    }

    const timestamp = Date.now();
    const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `${type}/${timestamp}-${safeFilename}`;
    const arrayBuffer = await file.arrayBuffer();
    const contentType = file.type || 'application/octet-stream';

    const publicUrl = await uploadToR2(key, arrayBuffer, contentType);

    return NextResponse.json({ publicUrl, filename: safeFilename });
  } catch (error) {
    console.error('Failed to upload image:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
