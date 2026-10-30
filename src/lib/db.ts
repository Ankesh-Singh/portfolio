import { getRequestContext } from "@cloudflare/next-on-pages";
import type { Post, PostType } from "./posts";

export async function getDb() {
  try {
    const ctx = getRequestContext();
    if (ctx?.env?.DB) {
      return ctx.env.DB;
    }
  } catch {}

  const { process } = globalThis as unknown as { process: { env: Record<string, unknown> } };
  return (process?.env as unknown as { DB: import('@cloudflare/workers-types').D1Database })?.DB;
}

function extractImageUrls(markdown: string | null): string[] {
  if (!markdown) return [];
  const regex = /!\[.*?\]\((https?:\/\/[^\s\)]+)\)/g;
  const urls: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(markdown)) !== null) {
    if (match[1]) urls.push(match[1]);
  }
  return urls;
}

export async function getPosts(
  type: PostType,
  limit?: number,
  tag?: string | null,
  offset?: number
): Promise<Post[]> {
  const db = await getDb();
  if (!db) return [];

  let query = "SELECT * FROM posts WHERE type = ?";
  const params: (string | number)[] = [type];

  if (tag && tag !== 'all') {
    query += " AND tag = ?";
    params.push(tag);
  }

  query += " ORDER BY id DESC";

  if (limit !== undefined && limit > 0) {
    query += " LIMIT ?";
    params.push(limit);

    if (offset !== undefined && offset > 0) {
      query += " OFFSET ?";
      params.push(offset);
    }
  }
  
  const stmt = db.prepare(query);
  const { results } = await stmt.bind(...params).all<Post>();
  return results || [];
}

export async function getPost(id: number): Promise<Post | null> {
  const db = await getDb();
  if (!db) return null;
  return await db.prepare("SELECT * FROM posts WHERE id = ?").bind(id).first<Post>();
}

export async function createPost(data: Partial<Post>): Promise<Post | null> {
  const db = await getDb();
  if (!db) return null;
  
  const type = data.type;
  const tag = data.tag || (type === 'reading' ? 'tech' : null);
  const title = data.title || null;
  const url = data.url || null;
  const banner_url = data.banner_url || null;
  const notes = data.notes || null;
  const extracted = extractImageUrls(notes);
  const note_images = data.note_images && data.note_images !== '[]'
    ? data.note_images
    : JSON.stringify(extracted);

  const { results } = await db.prepare(
    `INSERT INTO posts (type, tag, title, url, banner_url, notes, note_images)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     RETURNING *`
  ).bind(type, tag, title, url, banner_url, notes, note_images).all<Post>();

  return results[0] || null;
}

export async function updatePost(id: number, data: Partial<Post>): Promise<Post | null> {
  const db = await getDb();
  if (!db) return null;
  const current = await getPost(id);

  if (!current) {
    return null;
  }

  const type = data.type || current.type;
  const tag = data.tag === undefined ? current.tag : data.tag || null;
  const title = data.title === undefined ? current.title : data.title || null;
  const url = data.url === undefined ? current.url : data.url || null;
  const banner_url = data.banner_url === undefined ? current.banner_url : data.banner_url || null;
  const notes = data.notes === undefined ? current.notes : data.notes || null;
  const extracted = extractImageUrls(notes);
  const note_images = data.note_images === undefined
    ? JSON.stringify(extracted)
    : data.note_images || '[]';

  const { results } = await db.prepare(
    `UPDATE posts
     SET type = ?, tag = ?, title = ?, url = ?, banner_url = ?, notes = ?, note_images = ?
     WHERE id = ?
     RETURNING *`
  ).bind(type, tag, title, url, banner_url, notes, note_images, id).all<Post>();

  return results[0] || null;
}

export async function deletePost(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
}

export async function incrementClicks(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.prepare("UPDATE posts SET clicks = clicks + 1 WHERE id = ?").bind(id).run();
}
