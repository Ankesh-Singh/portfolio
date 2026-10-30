"use client";

import {
  Heading1, Heading2, Heading3, Bold, Italic, List, ListOrdered,
  Quote, Link2, ImagePlus, Eye, Pencil, Loader2
} from 'lucide-react';

interface ToolbarAction {
  icon: React.ReactNode;
  label: string;
  prefix: string;
  suffix: string;
  block?: boolean;
}

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  { icon: <Heading1 size={16} />, label: 'H1', prefix: '# ', suffix: '', block: true },
  { icon: <Heading2 size={16} />, label: 'H2', prefix: '## ', suffix: '', block: true },
  { icon: <Heading3 size={16} />, label: 'H3', prefix: '### ', suffix: '', block: true },
  { icon: <Bold size={16} />, label: 'Bold', prefix: '**', suffix: '**' },
  { icon: <Italic size={16} />, label: 'Italic', prefix: '*', suffix: '*' },
  { icon: <List size={16} />, label: 'Bullet List', prefix: '- ', suffix: '', block: true },
  { icon: <ListOrdered size={16} />, label: 'Numbered List', prefix: '1. ', suffix: '', block: true },
  { icon: <Quote size={16} />, label: 'Blockquote', prefix: '> ', suffix: '', block: true },
  { icon: <Link2 size={16} />, label: 'Link', prefix: '[', suffix: '](url)' },
];

interface MarkdownEditorToolbarProps {
  insertAtCursor: (prefix: string, suffix: string, block?: boolean) => void;
  imageUploading: boolean;
  editorTab: 'write' | 'preview';
  setEditorTab: (tab: 'write' | 'preview') => void;
  imageInputRef: React.RefObject<HTMLInputElement | null>;
  onInlineImageUpload: (files: FileList | null) => void;
}

export default function MarkdownEditorToolbar({
  insertAtCursor,
  imageUploading,
  editorTab,
  setEditorTab,
  imageInputRef,
  onInlineImageUpload,
}: MarkdownEditorToolbarProps) {
  return (
    <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-zinc-800 bg-zinc-900/50 flex-wrap">
      {TOOLBAR_ACTIONS.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={() => insertAtCursor(action.prefix, action.suffix, action.block)}
          title={action.label}
          className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          {action.icon}
        </button>
      ))}

      <div className="w-px h-5 bg-zinc-700 mx-1" />

      <button
        type="button"
        onClick={() => imageInputRef.current?.click()}
        disabled={imageUploading}
        title="Insert Image"
        className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-50"
      >
        {imageUploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
      </button>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => onInlineImageUpload(e.target.files)}
      />

      <div className="flex-1" />

      <div className="flex bg-zinc-900 rounded p-0.5">
        <button
          type="button"
          onClick={() => setEditorTab('write')}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
            editorTab === 'write' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Pencil size={12} /> Write
        </button>
        <button
          type="button"
          onClick={() => setEditorTab('preview')}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
            editorTab === 'preview' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Eye size={12} /> Preview
        </button>
      </div>
    </div>
  );
}
