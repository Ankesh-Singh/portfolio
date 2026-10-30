'use client'

import { useEffect, useState } from 'react'
import ThoughtCard from '@/components/cards/ThoughtCard'
import OnekoCat from '@/components/OnekoCat'
import FadeIn from '@/components/FadeIn'
import DiagonalPattern from '@/components/DiagonalPattern'
import PageNavigation from '@/components/Navigation'
import type { Post } from '@/lib/posts'

const PAGE_SIZE = 100

export default function ThoughtsListClient() {
  const [thoughts, setThoughts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0) // 0 = first (most recent) page

  useEffect(() => {
    fetch('/api/posts?type=thought')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load thoughts')
        return res.json()
      })
      .then((data) => setThoughts(Array.isArray(data) ? data : []))
      .catch(() => setThoughts([]))
      .finally(() => setLoading(false))
  }, [])

  const totalPages = Math.ceil(thoughts.length / PAGE_SIZE)
  const pageThoughts = thoughts.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  // Global index for numbering (1-based, continues across pages)
  const globalOffset = page * PAGE_SIZE

  return (
    <div className="min-h-screen transition-colors duration-300 relative" style={{ fontFamily: 'var(--font-hk-grotesk)' }}>
      <OnekoCat />
      <div className="relative mx-auto max-w-4xl min-h-screen">
        <DiagonalPattern side="left" topOffset="0" />
        <DiagonalPattern side="right" topOffset="0" />

        <div className="mx-auto sm:w-[calc(100%-120px)] w-full max-w-4xl sm:px-0">
          <div className="max-w-none">
            <div className="text-base">
              <FadeIn delay={0.1} duration={0.5}>
                <div className="sm:px-12 py-2">
                  <div className="px-4 mb-4 sm:mb-6 pt-4 sm:pt-6">
                    <div className="mb-4 sm:mb-6">
                      <PageNavigation />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-[family-name:var(--font-instrument-serif)] italic font-medium mb-4 text-neutral-900 dark:text-neutral-100 tracking-tight">
                      Thoughts
                    </h1>
                    <p className="text-lg text-neutral-500 dark:text-neutral-400 tracking-wide">
                      Notes, ideas, and things I&apos;m thinking about
                    </p>
                  </div>
                </div>
              </FadeIn>

              <div className="sm:px-12 py-2">
                <div className="px-4">
                  {loading ? (
                    <FadeIn delay={0.3} duration={0.5}>
                      <div className="text-center py-16 sm:py-20">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                          Loading
                        </p>
                      </div>
                    </FadeIn>
                  ) : pageThoughts.length > 0 ? (
                    <>
                      <div className="space-y-1">
                        {pageThoughts.map((thought, idx) => (
                          <FadeIn key={thought.id} delay={0.1 + idx * 0.02}>
                            <ThoughtCard
                              id={thought.id}
                              index={globalOffset + idx + 1}
                              notes={thought.notes}
                              url={thought.url}
                            />
                          </FadeIn>
                        ))}
                      </div>

                      {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                          <button
                            onClick={() => { setPage(p => p - 1); window.scrollTo(0, 0); }}
                            disabled={page === 0}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            ← Newer
                          </button>
                          <span className="text-xs text-neutral-400 dark:text-neutral-500">
                            {page + 1} / {totalPages}
                          </span>
                          <button
                            onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0); }}
                            disabled={page >= totalPages - 1}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            Older →
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <FadeIn delay={0.3} duration={0.5}>
                      <div className="text-center py-16 sm:py-20">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                          Coming soon
                        </p>
                      </div>
                    </FadeIn>
                  )}
                </div>
              </div>
              <div className="pb-24 sm:pb-28" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
