import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { verifyToken, getCookieName } from '@/lib/auth';
import Post from '@/models/Post';

const LIST_FIELDS = 'title slug excerpt coverImage category tags views createdAt';
const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || String(DEFAULT_PAGE), 10));
    const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') || String(DEFAULT_LIMIT), 10)));
    const category = searchParams.get('category')?.trim() || '';
    const tag = searchParams.get('tag')?.trim() || '';
    const statusParam = searchParams.get('status') ?? 'published';

    const filter: Record<string, unknown> = {};
    if (statusParam && statusParam !== 'all') filter.status = statusParam;
    if (category) filter.category = category;
    if (tag) filter.tags = tag;

    const skip = (page - 1) * limit;
    const [posts, totalPosts] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(LIST_FIELDS)
        .lean(),
      Post.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalPosts / limit) || 1;

    return NextResponse.json({
      posts,
      totalPosts,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error('GET /api/posts error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(getCookieName())?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      content,
      excerpt = '',
      coverImage = '',
      category = '',
      tags = [],
      status = 'draft',
    } = body;

    if (!title || content === undefined) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const normalizedTags = Array.isArray(tags) ? tags : [];
    const postStatus = status === 'published' ? 'published' : 'draft';

    await connectDB();

    const post = await Post.create({
      title: String(title).trim(),
      content: String(content),
      excerpt: String(excerpt).trim(),
      coverImage: String(coverImage).trim(),
      category: String(category).trim(),
      tags: normalizedTags.map((t: unknown) => String(t)),
      status: postStatus,
    });

    return NextResponse.json(post.toObject());
  } catch (err) {
    console.error('POST /api/posts error:', err);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
