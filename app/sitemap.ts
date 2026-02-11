import type { MetadataRoute } from 'next';

function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (url) return url.replace(/\/$/, '');
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return 'http://localhost:3000';
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseUrl();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${base}/blog`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${base}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  let postPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(
      `${base}/api/posts?status=published&limit=500&page=1`,
      { next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const data = await res.json();
      const posts = data.posts ?? [];
      postPages = posts.map(
        (post: { slug: string; createdAt?: string }) => ({
          url: `${base}/blog/${post.slug}`,
          lastModified: post.createdAt
            ? new Date(post.createdAt)
            : new Date(),
          changeFrequency: 'daily' as const,
          priority: 0.9,
        })
      );
    }
  } catch {
    // If fetch fails, only static entries are returned
  }

  return [...staticPages, ...postPages];
}
