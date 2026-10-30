"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { showToast } from '@/components/Toast';
import type { Post } from '@/lib/posts';
import MarkdownEditorToolbar from './MarkdownEditorToolbar';
import ReadingMarkdownPreview from './ReadingMarkdownPreview';
import { uploadImageWithWebp } from '@/lib/imageCompression';

interface AddReadingProps {
  onAdd: () => void;
  initialPost?: Post | null;
  onCancel?: () => void;
}

export default function AddReading({ onAdd, initialPost, onCancel }: AddReadingProps) {
  const isEditing = Boolean(initialPost);
  const [title, setTitle] = useState(initialPost?.title || '');
  const [url, setUrl] = useState(initialPost?.url || '');
  const [tag, setTag] = useState<'tech' | 'non-tech'>((initialPost?.tag as 'tech' | 'non-tech') || 'tech');
  const [notes, setNotes] = useState(initialPost?.notes || '');
  const [existingBannerUrl, setExistingBannerUrl] = useState<string | null>(initialPost?.banner_url || null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [useDefaultBanner, setUseDefaultBanner] = useState(!initialPost?.banner_url && !isEditing);
  const [loading, setLoading] = useState(false);
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write');
  const [imageUploading, setImageUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title || '');
      setUrl(initialPost.url || '');
      setTag((initialPost.tag as 'tech' | 'non-tech') || 'tech');
      setNotes(initialPost.notes || '');
      setExistingBannerUrl(initialPost.banner_url || null);
      setUseDefaultBanner(!initialPost.banner_url);
    }
  }, [initialPost]);

  const insertAtCursor = useCallback((prefix: string, suffix: string, block?: boolean) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = notes.substring(start, end);
    const beforeCursor = notes.substring(0, start);
    const afterCursor = notes.substring(end);

    let insertion: string;
    if (block && start > 0 && beforeCursor[beforeCursor.length - 1] !== '\n') {
      insertion = '\n' + prefix + (selectedText || 'text') + suffix;
    } else {
      insertion = prefix + (selectedText || 'text') + suffix;
    }

    const newValue = beforeCursor + insertion + afterCursor;
    setNotes(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selectedText.length || 4));
    }, 0);
  }, [notes]);

  const handleInlineImageUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setImageUploading(true);

    try {
      for (const file of Array.from(files)) {
        const { publicUrl } = await uploadImageWithWebp(file, 'readings');
        const imgMarkdown = `\n![${file.name}](${publicUrl})\n`;
        const textarea = textareaRef.current;
        if (textarea) {
          const pos = textarea.selectionStart;
          const before = notes.substring(0, pos);
          const after = notes.substring(pos);
          setNotes(before + imgMarkdown + after);
        } else {
          setNotes(prev => prev + imgMarkdown);
        }
      }
      showToast('Image(s) converted to WebP & inserted!');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Image upload failed', 'error');
    } finally {
      setImageUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  }, [notes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalBannerUrl = existingBannerUrl;

      if (useDefaultBanner) {
        finalBannerUrl = null;
      } else if (bannerFile) {
        const { publicUrl } = await uploadImageWithWebp(bannerFile, 'reading');
        finalBannerUrl = publicUrl || null;
      }

      if (isEditing && initialPost) {
        const res = await fetch(`/api/posts/${initialPost.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, url, tag, notes, banner_url: finalBannerUrl }),
        });
        if (!res.ok) throw new Error('Failed to update reading');
        showToast('Reading updated successfully!');
      } else {
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'reading', tag, title, url, notes, banner_url: finalBannerUrl }),
        });
        if (!res.ok) throw new Error('Failed to save reading');
        showToast('Reading added successfully!');
      }

      setTitle('');
      setUrl('');
      setTag('tech');
      setNotes('');
      setBannerFile(null);
      setExistingBannerUrl(null);
      setUseDefaultBanner(false);
      setEditorTab('write');
      onAdd();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to save reading', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{isEditing ? 'Edit Reading' : 'Create New Reading'}</h3>
        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-zinc-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-1">
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">Category / Tag</label>
          <div className="flex rounded-lg bg-zinc-950 p-1 border border-zinc-800">
            <button
              type="button"
              onClick={() => setTag('tech')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                tag === 'tech' ? 'bg-zinc-800 text-white shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              tech
            </button>
            <button
              type="button"
              onClick={() => setTag('non-tech')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                tag === 'non-tech' ? 'bg-zinc-800 text-white shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              non-tech
            </button>
          </div>
        </div>
        <div className="sm:col-span-1">
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">Title</label>
          <input
            type="text" required value={title} onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Designing Data-Intensive Applications"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none transition-colors text-sm"
          />
        </div>
        <div className="sm:col-span-1">
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">URL</label>
          <input
            type="url" required value={url} onChange={e => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none transition-colors text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Notes</label>
        <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
          <MarkdownEditorToolbar
            insertAtCursor={insertAtCursor}
            imageUploading={imageUploading}
            editorTab={editorTab}
            setEditorTab={setEditorTab}
            imageInputRef={imageInputRef}
            onInlineImageUpload={handleInlineImageUpload}
          />

          {editorTab === 'write' ? (
            <textarea
              ref={textareaRef}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={16}
              placeholder="Write your notes here using Markdown...&#10;&#10;# Heading 1&#10;## Heading 2&#10;**Bold text**, *italic text*&#10;&#10;- Bullet point&#10;> Blockquote&#10;&#10;Use the image button ↑ to insert images inline."
              className="w-full bg-transparent px-4 py-3 text-white resize-y min-h-[300px] focus:outline-none font-mono text-sm leading-relaxed placeholder:text-zinc-700"
            />
          ) : (
            <ReadingMarkdownPreview notes={notes} />
          )}
        </div>
      </div>

      {/* Banner Upload */}
      <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-3">
        <label className="block text-sm font-medium text-zinc-400">Cover Banner</label>
        
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="useDefaultBanner"
            checked={useDefaultBanner}
            onChange={(e) => setUseDefaultBanner(e.target.checked)}
            className="rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0 cursor-pointer"
          />
          <label htmlFor="useDefaultBanner" className="text-sm text-zinc-300 cursor-pointer">
            Use dynamic gradient banner
          </label>
        </div>

        {!useDefaultBanner && (
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer"
            />
            {existingBannerUrl && !bannerFile && (
              <p className="text-xs text-zinc-500 mt-1">Current banner in use: {existingBannerUrl}</p>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer"
      >
        {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Reading'}
      </button>
    </form>
  );
}
