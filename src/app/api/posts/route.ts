import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import slugify from 'slugify';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const niche = searchParams.get('niche');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  const posts = niche
    ? await db`
        SELECT id, title, slug, excerpt, cover_url, niche, tags, created_at
        FROM posts
        WHERE status = 'published' AND niche = ${niche}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    : await db`
        SELECT id, title, slug, excerpt, cover_url, niche, tags, created_at
        FROM posts
        WHERE status = 'published'
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, excerpt, cover_url, niche, tags, meta_description, source_url, source_article_id } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'title e content são obrigatórios' }, { status: 400 });
    }

    // Gera slug único
    const base = slugify(title, { lower: true, strict: true, locale: 'pt' });
    const [{ count }] = await db`SELECT COUNT(*) as count FROM posts WHERE slug LIKE ${base + '%'}`;
    const slug = Number(count) > 0 ? `${base}-${count}` : base;

    const [post] = await db`
      INSERT INTO posts (title, slug, content, excerpt, cover_url, niche, tags, meta_description, source_url, source_article_id)
      VALUES (
        ${title},
        ${slug},
        ${content},
        ${excerpt ?? null},
        ${cover_url ?? null},
        ${niche ?? null},
        ${db.array(tags ?? [])},
        ${meta_description ?? null},
        ${source_url ?? null},
        ${source_article_id ?? null}
      )
      RETURNING *
    `;

    return NextResponse.json(post, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}