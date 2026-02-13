import Link from 'next/link';
import PostCard from '@/components/blog/PostCard';

const CATEGORIES = [
  'AI Tools',
  'Productivity',
  'Tutorial',
  'Product Review',
  'News',
];

const LIMIT = 9;

async function getPosts(page: number, category?: string, tag?: string) {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(LIMIT));
  params.set('status', 'published');
  if (category) params.set('category', category);
  if (tag) params.set('tag', tag);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/posts?${params}`, {
    next: { revalidate: 30 },
  });

  if (!res.ok) return { posts: [], totalPosts: 0, totalPages: 0, currentPage: 1 };
  return res.json();
}

async function getLatestPosts() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(
    `${baseUrl}/api/posts?limit=5&page=1&status=published`,
    { next: { revalidate: 30 } }
  );

  if (!res.ok) return [];
  const data = await res.json();
  return data.posts ?? [];
}

type PageProps = {
  searchParams: Promise<{ page?: string; category?: string; tag?: string }>;
};

export default async function BlogListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || '1', 10));
  const category = params.category?.trim() || undefined;
  const tag = params.tag?.trim() || undefined;

  const [data, latest] = await Promise.all([
    getPosts(page, category, tag),
    getLatestPosts(),
  ]);

  const { posts, totalPosts, totalPages, currentPage } = data;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  function buildPageUrl(p: number) {
    const q = new URLSearchParams();
    if (category) q.set('category', category);
    if (tag) q.set('tag', tag);
    q.set('page', String(p));
    return `/blog?${q}`;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">
            {category ? `Category: ${category}` : tag ? `Tag: ${tag}` : 'Blog'}
          </h1>

          {posts.length === 0 ? (
            <p className="text-slate-500 py-8">No posts found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: Record<string, unknown>) => (
                <PostCard
                  key={String(post._id)}
                  title={String(post.title ?? '')}
                  slug={String(post.slug ?? '')}
                  excerpt={post.excerpt ? String(post.excerpt) : undefined}
                  coverImage={post.coverImage ? String(post.coverImage) : undefined}
                  category={post.category ? String(post.category) : undefined}
                  views={typeof post.views === 'number' ? post.views : 0}
                  createdAt={post.createdAt ? String(post.createdAt) : undefined}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav
              className="mt-10 flex flex-wrap items-center justify-center gap-2"
              aria-label="Pagination"
            >
              {hasPrev ? (
                <Link
                  href={buildPageUrl(currentPage - 1)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Previous
                </Link>
              ) : (
                <span className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-400 cursor-not-allowed">
                  Previous
                </span>
              )}
              <span className="flex items-center gap-1 px-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) =>
                    p === currentPage ? (
                      <span
                        key={p}
                        className="inline-flex w-9 h-9 items-center justify-center rounded-lg bg-slate-900 text-white text-sm font-medium"
                      >
                        {p}
                      </span>
                    ) : (
                      <Link
                        key={p}
                        href={buildPageUrl(p)}
                        className="inline-flex w-9 h-9 items-center justify-center rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
                      >
                        {p}
                      </Link>
                    )
                )}
              </span>
              {hasNext ? (
                <Link
                  href={buildPageUrl(currentPage + 1)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Next
                </Link>
              ) : (
                <span className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-400 cursor-not-allowed">
                  Next
                </span>
              )}
            </nav>
          )}
        </div>

        <aside className="lg:w-72 shrink-0">
          <div className="lg:sticky lg:top-24 space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
                Search
              </h3>
              <input
                type="search"
                placeholder="Search posts…"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
                aria-label="Search posts"
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
                Categories
              </h3>
              <ul className="space-y-2">
                {CATEGORIES.map((name) => (
                  <li key={name}>
                    <Link
                      href={`/blog?category=${encodeURIComponent(name)}`}
                      className="text-slate-600 hover:text-slate-900 text-sm"
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
                Latest Posts
              </h3>
                <ul className="space-y-3">
                  {latest.map((p: Record<string, unknown>) => (
                    <li key={String(p._id)}>
                      <Link
                        href={`/blog/${p.slug}`}
                        className="text-sm text-slate-600 hover:text-slate-900 line-clamp-2"
                      >
                        {String(p.title ?? '')}
                      </Link>
                    </li>
                  ))}
                </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
