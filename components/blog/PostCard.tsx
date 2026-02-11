import Link from 'next/link';
import Image from 'next/image';

export type PostCardProps = {
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  category?: string;
  views?: number;
  createdAt?: string;
};

export default function PostCard({
  title,
  slug,
  excerpt = '',
  coverImage,
  category,
  views = 0,
  createdAt,
}: PostCardProps) {
  const dateStr = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : '';

  return (
    <article className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/blog/${slug}`} className="block">
        {coverImage ? (
          <div className="relative aspect-video bg-slate-100">
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={false}
            />
          </div>
        ) : (
          <div className="aspect-video bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
            No image
          </div>
        )}
      </Link>
      <div className="p-4 sm:p-5">
        {category && (
          <Link
            href={`/blog?category=${encodeURIComponent(category)}`}
            className="inline-block text-xs font-medium text-slate-500 hover:text-slate-700 mb-2"
          >
            {category}
          </Link>
        )}
        <h2 className="text-lg font-semibold text-slate-900 line-clamp-2 mb-2">
          <Link href={`/blog/${slug}`} className="hover:underline">
            {title}
          </Link>
        </h2>
        {excerpt && (
          <p className="text-slate-600 text-sm line-clamp-2 mb-3">{excerpt}</p>
        )}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{dateStr}</span>
          {views > 0 && <span>{views} views</span>}
        </div>
        <Link
          href={`/blog/${slug}`}
          className="inline-block mt-3 text-sm font-medium text-slate-700 hover:text-slate-900"
        >
          Read More →
        </Link>
      </div>
    </article>
  );
}
