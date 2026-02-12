import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import PostCard from '@/components/blog/PostCard';

type Props = {
  params: Promise<{ slug: string }>;
};

async function getPost(slug: string) {
  const res = await fetch(`/api/posts/${encodeURIComponent(slug)}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) return null;
  return res.json();
}

async function getRelatedPosts(category: string, excludeSlug: string) {
  if (!category) return [];
  const res = await fetch(
    `/api/posts?limit=4&status=published&category=${encodeURIComponent(category)}`,
    { next: { revalidate: 30 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  const posts = data.posts ?? [];
  return posts.filter((p: { slug: string }) => p.slug !== excludeSlug).slice(0, 3);
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Post not found' };
  const fullTitle = post.title;
  const description =
    post.excerpt?.slice(0, 160) || `Read ${post.title} on AI Productivity Hub`;
  return {
    title: fullTitle,
    description,
    openGraph: { title: fullTitle, description },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post.category || '', post.slug);

  const dateStr = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {post.coverImage && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-100 mb-8">
          <Image
            src={post.coverImage}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-4">
        {post.category && (
          <Link
            href={`/blog?category=${encodeURIComponent(post.category)}`}
            className="font-medium text-slate-600 hover:text-slate-900"
          >
            {post.category}
          </Link>
        )}
        <span>{dateStr}</span>
        {typeof post.views === 'number' && post.views > 0 && (
          <span>{post.views} views</span>
        )}
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-6">
        {post.title}
      </h1>

      <div
        className="post-content text-slate-700 leading-relaxed [&_a]:text-slate-900 [&_a]:underline [&_a]:hover:no-underline [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_pre]:bg-slate-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4 [&_pre]:text-sm"
        dangerouslySetInnerHTML={{ __html: post.content || '' }}
      />

      {Array.isArray(post.tags) && post.tags.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Tags</h3>
          <ul className="flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <li key={tag}>
                <Link
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 hover:bg-slate-200"
                >
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {related.length > 0 && (
        <section className="mt-12 pt-10 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Related Posts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((p: Record<string, unknown>) => (
              <PostCard
                key={String(p._id)}
                title={String(p.title ?? '')}
                slug={String(p.slug ?? '')}
                excerpt={p.excerpt ? String(p.excerpt) : undefined}
                coverImage={p.coverImage ? String(p.coverImage) : undefined}
                category={p.category ? String(p.category) : undefined}
                views={typeof p.views === 'number' ? p.views : 0}
                createdAt={p.createdAt ? String(p.createdAt) : undefined}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
