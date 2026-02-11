'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type PostRow = {
  _id: string;
  title: string;
  slug: string;
  category?: string;
  status?: string;
  createdAt?: string;
};

type Stats = {
  total: number;
  published: number;
  draft: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [allRes, publishedRes, draftRes, recentRes] = await Promise.all([
          fetch('/api/posts?status=all&limit=1&page=1'),
          fetch('/api/posts?status=published&limit=1&page=1'),
          fetch('/api/posts?status=draft&limit=1&page=1'),
          fetch('/api/posts?status=all&limit=5&page=1'),
        ]);
        if (!allRes.ok || !publishedRes.ok || !draftRes.ok || !recentRes.ok) {
          setError('Failed to load dashboard');
          return;
        }
        const [allData, publishedData, draftData, recentData] = await Promise.all([
          allRes.json(),
          publishedRes.json(),
          draftRes.json(),
          recentRes.json(),
        ]);
        setStats({
          total: allData.totalPosts ?? 0,
          published: publishedData.totalPosts ?? 0,
          draft: draftData.totalPosts ?? 0,
        });
        setRecent(recentData.posts ?? []);
      } catch {
        setError('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-500">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-100 text-red-700 px-4 py-3">
        {error}
      </div>
    );
  }

  const cards = [
    { label: 'Total Posts', value: stats?.total ?? 0 },
    { label: 'Published', value: stats?.published ?? 0 },
    { label: 'Drafts', value: stats?.draft ?? 0 },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-semibold text-slate-800">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map(({ label, value }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500 font-medium">{label}</p>
            <p className="text-2xl font-semibold text-slate-800 mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-800">Recent Posts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium w-20" />
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-slate-500 text-center">
                    No posts yet.
                  </td>
                </tr>
              ) : (
                recent.map((post) => (
                  <tr key={post._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="px-5 py-3 text-slate-800 font-medium">{post.title}</td>
                    <td className="px-5 py-3 text-slate-600">{post.category || '—'}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                          post.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {post.status || 'draft'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/posts/${post._id}`}
                        className="text-slate-600 hover:text-slate-900 font-medium"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
