"use client";

import { useState } from 'react';
import { showToast } from '@/components/Toast';

import ThoughtCard from '@/components/cards/ThoughtCard';

export default function AddThought({ onAdd }: { onAdd: () => void }) {
  const [notes, setNotes] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'thought', notes, url: url || null })
      });
      if (!res.ok) throw new Error('Failed to save thought');

      setNotes('');
      setUrl('');
      showToast('Thought added successfully!');
      onAdd();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to add thought', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Editor Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <h3 className="text-xl font-bold">Add Thought</h3>
        
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">Note Content</label>
          <textarea 
            required 
            value={notes} 
            onChange={e => setNotes(e.target.value)} 
            rows={5}
            placeholder="Write your thought here..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-white resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">URL (Optional)</label>
          <input 
            type="url" 
            value={url} 
            onChange={e => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-white"
          />
          <p className="text-xs text-zinc-500 mt-2">X/Twitter and Substack URLs will be styled automatically.</p>
        </div>

        <button 
          type="submit" disabled={loading}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md disabled:opacity-50 transition-colors cursor-pointer"
        >
          {loading ? 'Adding...' : 'Add Thought'}
        </button>
      </form>

      {/* Live Preview Panel */}
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 flex flex-col">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Live Preview</h4>
          <span className="text-xs text-zinc-500">How it appears on /thoughts</span>
        </div>
        <div className="flex-1 bg-zinc-950/60 p-4 rounded-lg border border-zinc-800/80 flex items-center justify-center">
          <div className="w-full max-w-md">
            <ThoughtCard id={0} index={1} notes={notes || null} url={url || null} />
          </div>
        </div>
      </div>
    </div>
  );
}
