'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import RichTextEditor from '@/components/admin/RichTextEditor';

const CATEGORIES = ['AI Tools', 'Productivity', 'Tutorial', 'Product Review', 'News'];
const EXCERPT_MAX = 160;

type Post = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  status?: string;
};

export default function AdminEditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/posts/by-id/${id}`, { credentials: 'include' });
        if (!res.ok) {
          if (res.status === 404) router.push('/admin/posts');
          return;
        }
        const data = await res.json();
        if (cancelled) return;
        setPost(data);
        setTitle(data.title ?? '');
        setCategory(data.category ?? '');
        setTagsStr(Array.isArray(data.tags) ? data.tags.join(', ') : '');
        setExcerpt(data.excerpt ?? '');
        setCoverImage(data.coverImage ?? '');
        setContent(data.content ?? '');
        setStatus(data.status === 'published' ? 'published' : 'draft');
      } catch {
        if (!cancelled) setMessage({ type: 'error', text: 'Failed to load post' });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('🔵 Starting cover image upload:', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.set('image', file);

      console.log('🚀 Sending upload request to /api/upload...');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      console.log('📥 Upload response received:', {
        status: res.status,
        ok: res.ok,
      });

      const data = await res.json();

      console.log('📦 Response data:', data);

      if (!res.ok) {
        console.error('❌ Upload failed:', data.error);
        throw new Error(data.error || 'Upload failed');
      }

      if (!data.url) {
        console.error('❌ No URL in response:', data);
        throw new Error('No URL returned from upload');
      }

      console.log('✅ Upload successful! URL:', data.url);
      setCoverImage(data.url);
      setMessage({ type: 'success', text: 'Image uploaded successfully!' });
    } catch (err) {
      console.error('❌ Upload error:', err);
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Upload failed',
      });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!post) return;
    setMessage(null);
    setSaving(true);
    try {
      const tags = tagsStr
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const res = await fetch(`/api/posts/${encodeURIComponent(post.slug)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: title.trim(),
          content: content || '<p></p>',
          excerpt: excerpt.slice(0, EXCERPT_MAX),
          coverImage,
          category: category.trim(),
          tags,
          status,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to update post' });
        return;
      }
      setPost(data);
      setMessage({ type: 'success', text: 'Post updated.' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to update post' });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!post) return;
    setDeleting(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/posts/${encodeURIComponent(post.slug)}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to delete' });
        return;
      }
      router.push('/admin/posts');
      router.refresh();
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete post' });
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-500">Loading…</p>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h2 className="text-lg font-semibold text-slate-800">Edit Post</h2>

      {message && (
        <div
          className={`rounded-lg px-4 py-3 ${message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
              : 'bg-red-50 text-red-700 border border-red-100'
            }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
            placeholder="Post title"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-1">
            Tags (comma separated)
          </label>
          <input
            id="tags"
            type="text"
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
            placeholder="e.g. AI, tools, tutorial"
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-slate-700 mb-1">
            Excerpt (max {EXCERPT_MAX} characters)
          </label>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value.slice(0, EXCERPT_MAX))}
            rows={2}
            maxLength={EXCERPT_MAX}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
            placeholder="Short description for cards"
          />
          <p className="text-xs text-slate-500 mt-0.5">{excerpt.length}/{EXCERPT_MAX}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Cover Image
          </label>
          <div className="flex items-start gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              disabled={uploading}
              className="text-sm text-slate-600 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
            />
            {coverImage && (
              <div className="shrink-0">
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="h-20 w-32 object-cover rounded-lg border border-slate-200"
                />
              </div>
            )}
          </div>
          {uploading && <p className="text-sm text-slate-500 mt-1">Uploading…</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Content
          </label>
          <RichTextEditor content={content} onChange={setContent} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Status
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                checked={status === 'draft'}
                onChange={() => setStatus('draft')}
                className="text-slate-600 focus:ring-slate-500"
              />
              <span className="text-slate-700">Draft</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                checked={status === 'published'}
                onChange={() => setStatus('published')}
                className="text-slate-600 focus:ring-slate-500"
              />
              <span className="text-slate-700">Published</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-slate-800 text-white px-5 py-2.5 text-sm font-medium hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {saving ? 'Updating…' : 'Update Post'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-slate-300 text-slate-700 px-5 py-2.5 text-sm font-medium hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-lg border border-red-200 text-red-600 px-5 py-2.5 text-sm font-medium hover:bg-red-50 ml-auto"
          >
            Delete Post
          </button>
        </div>
      </form>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <p className="text-slate-800 font-medium mb-2">Delete this post?</p>
            <p className="text-sm text-slate-500 mb-4">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
