import Link from 'next/link';
import { db } from '@/lib/db';

const NICHES = [
  { key: null, label: 'Tudo' },
  { key: 'games', label: 'Games' },
  { key: 'cultura_pop', label: 'Cultura Pop' },
  { key: 'tech_ai', label: 'Tech & IA' },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: { niche?: string };
}) {
  const niche = searchParams.niche;

  const posts = niche
    ? await db`
        SELECT id, title, slug, excerpt, cover_url, niche, tags, created_at
        FROM posts WHERE status = 'published' AND niche = ${niche}
        ORDER BY created_at DESC LIMIT 20
      `
    : await db`
        SELECT id, title, slug, excerpt, cover_url, niche, tags, created_at
        FROM posts WHERE status = 'published'
        ORDER BY created_at DESC LIMIT 20
      `;

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      <header style={{ marginBottom: 48 }}>
        <h1 style={{ fontSize: 48, fontWeight: 900, color: '#00ff88', letterSpacing: -2 }}>
          PopCrash
        </h1>
        <p style={{ color: '#555570', marginTop: 8 }}>Games · Cultura Pop · Entretenimento</p>
      </header>

      <nav style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
        {NICHES.map(({ key, label }) => (
          <Link
            key={label}
            href={key ? `/?niche=${key}` : '/'}
            style={{
              padding: '6px 16px',
              borderRadius: 6,
              border: '1px solid #1e1e2e',
              color: searchParams.niche === key ? '#00ff88' : '#e2e2f0',
              textDecoration: 'none',
              fontSize: 14,
            }}
          >
            {label}
          </Link>
        ))}
      </nav>

      {posts.length === 0 ? (
        <p style={{ color: '#555570' }}>Nenhuma matéria publicada ainda.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {posts.map((post) => (
            <Link key={post.id} href={`/posts/${post.slug}`} style={{ textDecoration: 'none' }}>
              <article style={{
                background: '#111118',
                border: '1px solid #1e1e2e',
                borderRadius: 8,
                overflow: 'hidden',
              }}>
                {post.cover_url && (
                  <img src={post.cover_url} alt={post.title} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                )}
                <div style={{ padding: 20 }}>
                  {post.niche && (
                    <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#00ff88', textTransform: 'uppercase', letterSpacing: 2 }}>
                      {post.niche.replace('_', ' ')}
                    </span>
                  )}
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: '8px 0', color: '#e2e2f0' }}>{post.title}</h2>
                  {post.excerpt && (
                    <p style={{ fontSize: 14, color: '#555570', lineHeight: 1.6 }}>{post.excerpt}</p>
                  )}
                  <p style={{ fontSize: 12, color: '#333350', marginTop: 12 }}>
                    {new Date(post.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}