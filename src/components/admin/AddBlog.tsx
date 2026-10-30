"use client";

import { useState } from 'react';
import { showToast } from '@/components/Toast';
import { uploadImageWithWebp } from '@/lib/imageCompression';

export default function AddBlog({ onAdd }: { onAdd: () => void }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [useDefaultBanner, setUseDefaultBanner] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let finalBannerUrl = null;

      if (!useDefaultBanner && bannerFile) {
        const { publicUrl } = await uploadImageWithWebp(bannerFile, 'blog');
        finalBannerUrl = publicUrl;
      }

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'blog', title, url, banner_url: finalBannerUrl })
      });
      if (!res.ok) throw new Error('Failed to save blog');

      setTitle('');
      setUrl('');
      setBannerFile(null);
      setUseDefaultBanner(false);
      showToast('Blog added successfully!');
      onAdd();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to add blog', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-zinc-900 p-6 rounded-xl border border-zinc-800">
      <h3 className="text-xl font-bold">Add Blog</h3>
      
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
        <input 
          type="text" required value={title} onChange={e => setTitle(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">URL</label>
        <input 
          type="url" required value={url} onChange={e => setUrl(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2">Banner Image</label>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input 
            type="checkbox" checked={useDefaultBanner} onChange={e => setUseDefaultBanner(e.target.checked)}
            className="rounded bg-zinc-950 border-zinc-800"
          />
          Use default banner
        </label>
        {!useDefaultBanner && (
          <input 
            type="file" accept="image/*"
            onChange={e => setBannerFile(e.target.files?.[0] || null)}
            className="mt-2 block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700"
          />
        )}
      </div>

      <button 
        type="submit" disabled={loading}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50 transition-colors"
      >
        {loading ? 'Adding...' : 'Add Blog'}
      </button>
    </form>
  );
}
