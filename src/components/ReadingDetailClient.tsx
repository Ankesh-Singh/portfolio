'use client'

import Image from 'next/image'
import OnekoCat from '@/components/OnekoCat'
import FadeIn from '@/components/FadeIn'
import { FadeInUp } from '@/components/ui/PageTransitions'
import DiagonalPattern from '@/components/DiagonalPattern'
import PageNavigation from '@/components/Navigation'
import type { Post } from '@/lib/posts'
import { getDefaultBanner } from '@/lib/posts'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface ReadingDetailClientProps {
  post: Post;
}

export default function ReadingDetailClient({ post }: ReadingDetailClientProps) {
  const banner = post.banner_url || getDefaultBanner('reading', post.id)
  const [nextReads, setNextReads] = useState<Post[]>([])

  useEffect(() => {
    fetch('/api/posts?type=reading')
      .then(r => r.json())
      .then(json => {
        const data = json as Post[]
        if (!Array.isArray(data)) return
        // Exclude current post, take up to 3 others
        const others = data.filter(p => p.id !== post.id).slice(0, 3)
        setNextReads(others)
      })
      .catch(() => {})
  }, [post.id])

  const handleUrlClick = () => {
    fetch(`/api/posts/${post.id}/click`, { method: 'POST' }).catch(console.error)
    if (post.url) window.open(post.url, '_blank')
  }

  return (
    <div className="min-h-screen transition-colors duration-300 relative" style={{ fontFamily: 'var(--font-hk-grotesk)' }}>
      <OnekoCat />
      <div className="relative mx-auto max-w-4xl">
        <DiagonalPattern side="left" topOffset="0" />
        <DiagonalPattern side="right" topOffset="0" />

        <div className="mx-auto sm:w-[calc(100%-120px)] w-full max-w-4xl sm:px-0">
          <div className="prose dark:prose-invert max-w-none">
            <div className="text-base">
              <FadeIn delay={0.1} duration={0.5}>
                <div className="sm:px-12 py-2">
                  <div className="px-4 mb-4 sm:mb-6 pt-4 sm:pt-6">
                    <div className="mb-4 sm:mb-6">
                      <PageNavigation />
                    </div>
                  </div>
                </div>
              </FadeIn>

              <FadeInUp delay={0.4}>
                <div className="sm:px-12 py-2">
                  <div className="px-4">
                    <div className="bg-neutral-100/50 dark:bg-zinc-900 rounded-2xl border border-neutral-200 dark:border-zinc-800 overflow-hidden shadow-2xl">
                      {/* Hero — reduced height */}
                      <div className="relative h-48 sm:h-64 w-full bg-neutral-200 dark:bg-zinc-800">
                        <Image
                          src={banner}
                          alt={post.title || 'Reading'}
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>

                      <div className="p-6 sm:p-8 space-y-4">
                        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white leading-snug">
                          {post.title || 'Untitled Reading'}
                        </h1>

                        {post.url && (
                          <button
                            onClick={handleUrlClick}
                            className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors font-medium text-sm border border-neutral-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 bg-neutral-100 dark:bg-zinc-900/50"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={
                                post.url.toLowerCase().includes('substack.com')
                                  ? '/logo/substack-icon.svg'
                                  : post.url.toLowerCase().includes('x.com') || post.url.toLowerCase().includes('twitter.com')
                                  ? '/logo/x-company-solid.svg'
                                  : '/logo/hyperlink-linked-icon.svg'
                              }
                              alt=""
                              className="w-4 h-4 rounded object-contain dark:invert"
                            />
                            <span>Read Original</span>
                          </button>
                        )}

                        {post.notes ? <div className="mt-6">
                             <ReactMarkdown
                               components={{
                                 p: ({ children }) => (
                                   <p className="text-neutral-700 dark:text-zinc-300 leading-relaxed mb-4 whitespace-pre-wrap">{children}</p>
                                 ),
                                 h1: ({ children }) => (
                                   <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4 mt-6 pb-2 border-b border-neutral-200 dark:border-zinc-800">{children}</h1>
                                 ),
                                 h2: ({ children }) => (
                                   <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 mt-5">{children}</h2>
                                 ),
                                 h3: ({ children }) => (
                                   <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 mt-4">{children}</h3>
                                 ),
                                 blockquote: ({ children }) => (
                                   <blockquote className="border-l-4 border-neutral-300 dark:border-zinc-700 pl-4 italic text-neutral-600 dark:text-zinc-400 my-4 whitespace-pre-wrap">{children}</blockquote>
                                 ),
                                 ul: ({ children }) => (
                                   <ul className="list-disc pl-6 mb-4 space-y-1 text-neutral-700 dark:text-zinc-300">{children}</ul>
                                 ),
                                 ol: ({ children }) => (
                                   <ol className="list-decimal pl-6 mb-4 space-y-1 text-neutral-700 dark:text-zinc-300">{children}</ol>
                                 ),
                                 li: ({ children }) => (
                                   <li className="text-neutral-700 dark:text-zinc-300 whitespace-pre-wrap">{children}</li>
                                 ),
                                 a: ({ href, children }) => (
                                   <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{children}</a>
                                 ),
                                 code: ({ className, children }) => {
                                   const isInline = !className;
                                   return isInline ? (
                                     <code className="bg-neutral-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-emerald-600 dark:text-emerald-400 font-mono text-sm">{children}</code>
                                   ) : (
                                     <pre className="bg-neutral-100 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-lg p-4 overflow-x-auto my-4 font-mono text-sm text-neutral-700 dark:text-zinc-300">
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
                                       className="rounded-lg border border-neutral-200 dark:border-zinc-700 w-full h-auto"
                                       loading="lazy"
                                     />
                                   </span>
                                 ),
                               }}
                             >
                               {post.notes}
                             </ReactMarkdown>
                           </div> : (
                          <p className="text-neutral-500 italic mt-4">No notes for this reading.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInUp>

              {/* Next Readings */}
              {nextReads.length > 0 && (
                <FadeIn delay={0.6} duration={0.5}>
                  <div className="sm:px-12 py-2 mt-8">
                    <div className="px-4">
                      <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-4">
                        More Readings
                      </h2>
                      <div className="flex flex-col gap-3">
                        {nextReads.map((r) => {
                          const rb = r.banner_url || getDefaultBanner('reading', r.id)
                          return (
                            <Link
                              key={r.id}
                              href={`/reading/${r.id}`}
                              className="group flex overflow-hidden rounded-xl bg-neutral-100/50 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 hover:border-neutral-300 dark:hover:border-zinc-700 transition-colors h-[100px]"
                            >
                              <div className="relative w-[55%] shrink-0 overflow-hidden bg-neutral-200 dark:bg-zinc-800">
                                <Image
                                  src={rb}
                                  alt={r.title || 'Reading'}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 flex items-center px-4 py-3 min-w-0">
                                <span className="text-sm font-semibold text-neutral-800 dark:text-zinc-100 group-hover:text-neutral-600 dark:group-hover:text-zinc-300 transition-colors line-clamp-3 leading-snug">
                                  {r.title || 'Untitled Reading'}
                                </span>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              )}

              <div className="pb-24 sm:pb-28" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
