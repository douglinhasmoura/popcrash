import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const [post] = await db`SELECT title, meta_description, excerpt FROM posts WHERE slug = ${params.slug}`;
  if (!post) return {};
  return {
    title: `${post.title} — PopCrash`,
    description: post.meta_description || post.excerpt || '',
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const [post] = await db`
    SELECT * FROM posts WHERE slug = ${params.slug} AND status = 'published'
  `;

  if (!post) notFound();

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
      <Link href="/" style={{ color: '#555570', textDecoration: 'none', fontSize: 14 }}>
        ← PopCrash
      </Link>

      {post.cover_url && (
        <img src={post.cover_url} alt={post.title}
          style={{ width: '100%', height: 400, objectFit: 'cover', borderRadius: 8, marginTop: 24 }} />
      )}

      <article style={{ marginTop: 32 }}>
        {post.niche && (
          <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#00ff88', textTransform: 'uppercase', letterSpacing: 2 }}>
            {post.niche.replace('_', ' ')}
          </span>
        )}
        <h1 style={{ fontSize: 36, fontWeight: 900, marginTop: 12, lineHeight: 1.2 }}>{post.title}</h1>
        <p style={{ color: '#555570', fontSize: 13, marginTop: 8 }}>
          {new Date(post.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
        <div style={{ marginTop: 32, lineHeight: 1.8, color: '#c0c0d0' }}
          dangerouslySetInnerHTML={{ __html: post.content }} />
        {post.source_url && (
          <p style={{ marginTop: 32, fontSize: 13, color: '#333350' }}>
            Fonte: <a href={post.source_url} target="_blank" rel="noopener noreferrer" style={{ color: '#555570' }}>
              {post.source_url}
            </a>
          </p>
        )}
      </article>
    </main>
  );
}