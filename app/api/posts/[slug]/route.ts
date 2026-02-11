import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { verifyToken, getCookieName } from '@/lib/auth';
import Post from '@/models/Post';
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug;
  let counter = 0;
  while (true) {
    const filter: Record<string, unknown> = { slug };
    if (excludeId) filter._id = { $ne: excludeId };
    const existing = await Post.findOne(filter).select('_id');
    if (!existing) return slug;
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    if (!slug) {
      return NextResponse.json({ error: 'Slug required' }, { status: 400 });
    }

    await connectDB();

    const post = await Post.findOne({ slug }).lean();
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.status === 'published') {
      await Post.updateOne(
        { slug },
        { $inc: { views: 1 } }
      );
    }

    const result = { ...post, views: (post.views ?? 0) + (post.status === 'published' ? 1 : 0) };
    return NextResponse.json(result);
  } catch (err) {
    console.error('GET /api/posts/[slug] error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const token = request.cookies.get(getCookieName())?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const { slug } = await context.params;
    if (!slug) {
      return NextResponse.json({ error: 'Slug required' }, { status: 400 });
    }

    const body = await request.json();
    const {
      title,
      content,
      excerpt,
      coverImage,
      category,
      tags,
      status,
    } = body;

    await connectDB();

    const post = await Post.findOne({ slug });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const originalTitle = post.title;
    if (title !== undefined) post.title = String(title).trim();
    if (content !== undefined) post.content = String(content);
    if (excerpt !== undefined) post.excerpt = String(excerpt).trim();
    if (coverImage !== undefined) post.coverImage = String(coverImage).trim();
    if (category !== undefined) post.category = String(category).trim();
    if (tags !== undefined) post.tags = Array.isArray(tags) ? tags.map((t: unknown) => String(t)) : post.tags;
    if (status !== undefined) post.status = status === 'published' ? 'published' : 'draft';

    const titleChanged = title !== undefined && String(title).trim() !== originalTitle;
    if (titleChanged && post.title) {
      const baseSlug = slugify(post.title);
      post.slug = await ensureUniqueSlug(baseSlug, post._id.toString());
    }

    await post.save();
    return NextResponse.json(post.toObject());
  } catch (err) {
    console.error('PUT /api/posts/[slug] error:', err);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const token = _request.cookies.get(getCookieName())?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const { slug } = await context.params;
    if (!slug) {
      return NextResponse.json({ error: 'Slug required' }, { status: 400 });
    }

    await connectDB();

    const result = await Post.deleteOne({ slug });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/posts/[slug] error:', err);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
