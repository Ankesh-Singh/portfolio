"use client";

import { useCallback, useEffect, useState } from 'react';
import { Trash2, Pencil, ChevronLeft, ChevronRight } from 'lucide-react';
import { showToast } from '@/components/Toast';
import type { Post } from '@/lib/posts';

const ITEMS_PER_PAGE = 15;

interface PostListProps {
  type: 'blog' | 'reading' | 'thought';
  refreshKey?: number;
  onEdit?: (post: Post) => void;
}

export default function PostList({ type, refreshKey = 0, onEdit }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPosts = useCallback(() => {
    setLoading(true);
    fetch(`/api/posts?type=${type}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load posts');
        return res.json();
      })
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [type]);

  useEffect(() => {
    fetchPosts();
    setPage(1);
  }, [fetchPosts, refreshKey]);

  const confirmDelete = async () => {
    if (postToDelete === null) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/posts/${postToDelete}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete post');

      showToast('Post deleted successfully!');
      setPostToDelete(null);
      fetchPosts();
    } catch {
      showToast('Failed to delete post', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="text-zinc-400 py-8 text-center">Loading posts...</div>;
  if (!Array.isArray(posts)) return <div className="text-red-400 py-8 text-center">Failed to load posts or database not configured.</div>;
  if (posts.length === 0) return <div className="text-zinc-500 py-8 text-center">No {type}s found. Create your first one!</div>;

  const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);
  const startIdx = (page - 1) * ITEMS_PER_PAGE;
  const paginatedPosts = posts.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-zinc-200">
          {posts.length} {type}{posts.length !== 1 ? 's' : ''}
        </h3>
        <span className="text-sm text-zinc-500">
          Showing {startIdx + 1}–{Math.min(startIdx + ITEMS_PER_PAGE, posts.length)} of {posts.length}
        </span>
      </div>

      {paginatedPosts.map(post => (
        <div key={post.id} className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors">
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-white truncate">
              {type === 'thought' ? post.notes || post.title || 'Untitled Thought' : post.title || post.url || 'Untitled'}
            </h4>
            <div className="flex items-center gap-3 mt-1.5 text-sm text-zinc-500 flex-wrap">
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
              <span>•</span>
              <span>{post.clicks} clicks</span>
              {type === 'reading' && post.tag && (
                <>
                  <span>•</span>
                  <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {post.tag}
                  </span>
                </>
              )}
              {type !== 'thought' && post.url && (
                <>
                  <span>•</span>
                  <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate max-w-[200px]">
                    {post.url}
                  </a>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-4">
            {onEdit && (
              <button
                onClick={() => onEdit(post)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
                title="Edit"
              >
                <Pencil size={18} />
              </button>
            )}
            <button
              onClick={() => setPostToDelete(post.id)}
              className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-md transition-colors"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4 border-t border-zinc-800 mt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                page === p ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {postToDelete !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white mb-2">Delete {type}?</h3>
            <p className="text-zinc-400 text-sm mb-6">
              Are you sure you want to delete this {type}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                disabled={isDeleting}
                onClick={() => setPostToDelete(null)}
                className="px-4 py-2 rounded-md text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={confirmDelete}
                className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
