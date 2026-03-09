import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const [post] = await db`
    SELECT * FROM posts
    WHERE slug = ${params.slug} AND status = 'published'
  `;

  if (!post) {
    return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
  }

  return NextResponse.json(post);
}