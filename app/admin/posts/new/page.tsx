'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/admin/RichTextEditor';

const CATEGORIES = ['AI Tools', 'Productivity', 'Tutorial', 'Product Review', 'News'];
const EXCERPT_MAX = 160;

export default function AdminNewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
    setMessage(null);
    setSaving(true);
    try {
      const tags = tagsStr
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const res = await fetch('/api/posts', {
        method: 'POST',
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
        setMessage({ type: 'error', text: data.error || 'Failed to save post' });
        return;
      }
      setMessage({ type: 'success', text: 'Post saved.' });
      router.push('/admin/posts');
      router.refresh();
    } catch {
      setMessage({ type: 'error', text: 'Failed to save post' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h2 className="text-lg font-semibold text-slate-800">New Post</h2>

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
            {saving ? 'Saving…' : 'Save Post'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-slate-300 text-slate-700 px-5 py-2.5 text-sm font-medium hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
