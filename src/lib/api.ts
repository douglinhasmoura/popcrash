const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_url: string | null;
  niche: string | null;
  tags: string[];
  created_at: string;
}

export interface PostDetail extends Post {
  content: string;
  meta_description: string | null;
  source_url: string | null;
}

export async function getPosts(niche?: string, page = 1): Promise<Post[]> {
  const params = new URLSearchParams({ page: String(page), limit: '20' });
  if (niche) params.set('niche', niche);
  const res = await fetch(`${API_URL}/posts?${params}`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  return res.json();
}

export async function getPost(slug: string): Promise<PostDetail | null> {
  const res = await fetch(`${API_URL}/posts/${slug}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}