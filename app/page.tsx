import Link from 'next/link';
import PostCard from '@/components/blog/PostCard';
import NewsletterForm from '@/components/NewsletterForm';

const CATEGORIES = [
  'AI Tools',
  'Productivity',
  'Tutorial',
  'Product Review',
  'News',
];

async function getFeaturedPosts() {
  try {
    const res = await fetch(`/api/posts?limit=3&status=published`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const posts = await getFeaturedPosts();

  return (
    <div>
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Master AI Tools & Boost Your Productivity
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            Tutorials, reviews and guides for AI tools, productivity apps and
            more
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 text-white px-6 py-3 font-medium hover:bg-slate-800 transition-colors"
            >
              Read Latest Posts
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-lg border-2 border-slate-300 text-slate-700 px-6 py-3 font-medium hover:border-slate-400 hover:bg-slate-50 transition-colors"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">
          Featured Posts
        </h2>
        {posts.length === 0 ? (
          <p className="text-slate-500">No posts yet. Check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </section>

      <section className="bg-slate-50 border-y border-slate-200 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((name) => (
              <Link
                key={name}
                href={`/blog?category=${encodeURIComponent(name)}`}
                className="bg-white rounded-xl border border-slate-200 p-6 text-center font-medium text-slate-800 hover:border-slate-300 hover:shadow-md transition-all"
              >
                {name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Stay in the loop
        </h2>
        <p className="text-slate-600 mb-6">
          Get the latest tutorials and guides in your inbox.
        </p>
        <NewsletterForm />
      </section>
    </div>
  );
}
