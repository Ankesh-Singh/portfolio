"use client";

import ReactMarkdown from 'react-markdown';

interface ReadingMarkdownPreviewProps {
  notes: string;
}

export default function ReadingMarkdownPreview({ notes }: ReadingMarkdownPreviewProps) {
  if (!notes) {
    return (
      <div className="px-4 py-3 min-h-[300px]">
        <p className="text-zinc-600 italic">Nothing to preview yet. Switch to Write and start typing.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 min-h-[300px]">
      <ReactMarkdown
        components={{
          p: ({ children }) => (
            <p className="text-zinc-300 leading-relaxed mb-4 whitespace-pre-wrap">{children}</p>
          ),
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-white mb-4 mt-6 pb-2 border-b border-zinc-800">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-white mb-3 mt-5">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-bold text-white mb-2 mt-4">{children}</h3>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-zinc-700 pl-4 italic text-zinc-400 my-4 whitespace-pre-wrap">{children}</blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-4 space-y-1 text-zinc-300">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-4 space-y-1 text-zinc-300">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-zinc-300 whitespace-pre-wrap">{children}</li>
          ),
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{children}</a>
          ),
          code: ({ className, children }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-emerald-400 font-mono text-sm">{children}</code>
            ) : (
              <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 overflow-x-auto my-4 font-mono text-sm text-zinc-300">
                <code className={className}>{children}</code>
              </pre>
            );
          },
          img: ({ src, alt }) => (
            <span className="block my-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src || ''}
                alt={alt || ''}
                className="rounded-lg border border-zinc-800 w-full h-auto"
                loading="lazy"
              />
            </span>
          ),
        }}
      >
        {notes}
      </ReactMarkdown>
    </div>
  );
}
