'use client'

import { useEffect, useState } from 'react'
import ReadingCard from '@/components/cards/ReadingCard'
import OnekoCat from '@/components/OnekoCat'
import FadeIn from '@/components/FadeIn'
import DiagonalPattern from '@/components/DiagonalPattern'
import PageNavigation from '@/components/Navigation'
import type { Post } from '@/lib/posts'

const PAGE_SIZE = 20
type TagFilter = 'all' | 'tech' | 'non-tech'

export default function ReadingsListClient() {
  const [readings, setReadings] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTag, setActiveTag] = useState<TagFilter>('all')
  const [page, setPage] = useState(0)

  useEffect(() => {
    setLoading(true)
    const tagQuery = activeTag !== 'all' ? `&tag=${activeTag}` : ''
    fetch(`/api/posts?type=reading${tagQuery}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load readings')
        return res.json()
      })
      .then((data) => setReadings(Array.isArray(data) ? data : []))
      .catch(() => setReadings([]))
      .finally(() => setLoading(false))
  }, [activeTag])

  const totalPages = Math.ceil(readings.length / PAGE_SIZE)
  const pageReadings = readings.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div className="min-h-screen transition-colors duration-300 relative" style={{ fontFamily: 'var(--font-hk-grotesk)' }}>
      <OnekoCat />
      <div className="relative mx-auto max-w-4xl min-h-screen">
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
                    <h1 className="text-2xl sm:text-3xl font-[family-name:var(--font-instrument-serif)] italic font-medium mb-4 text-neutral-900 dark:text-neutral-100 tracking-tight">
                      My Reading
                    </h1>
                    <p className="text-lg text-neutral-500 dark:text-neutral-400 tracking-wide mb-6">
                      Books and articles I&apos;ve read
                    </p>

                    {/* 3 Tag Filter Buttons */}
                    <div className="flex items-center gap-2 not-prose">
                      {(['all', 'tech', 'non-tech'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setActiveTag(t)
                            setPage(0)
                          }}
                          className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                            activeTag === t
                              ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm font-semibold'
                              : 'bg-neutral-100 dark:bg-zinc-800/80 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-transparent hover:border-neutral-300 dark:hover:border-zinc-700'
                          }`}
                        >
                          {t === 'all' ? 'All' : t === 'tech' ? 'tech' : 'non-tech'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>

              <div className="sm:px-12 py-2">
                <div className="px-4">
                  {loading ? (
                    <FadeIn delay={0.1} duration={0.3}>
                      <div className="text-center py-16 sm:py-20">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                          Loading
                        </p>
                      </div>
                    </FadeIn>
                  ) : pageReadings.length > 0 ? (
                    <>
                      <div className="flex flex-col gap-3">
                        {pageReadings.map((reading, index) => (
                          <FadeIn key={reading.id} delay={0.05 + index * 0.03}>
                            <ReadingCard {...reading} />
                          </FadeIn>
                        ))}
                      </div>

                      {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800 not-prose">
                          <button
                            onClick={() => { setPage(p => p - 1); window.scrollTo(0, 0); }}
                            disabled={page === 0}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          >
                            ← Newer
                          </button>
                          <span className="text-xs text-neutral-400 dark:text-neutral-500">
                            {page + 1} / {totalPages}
                          </span>
                          <button
                            onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0); }}
                            disabled={page >= totalPages - 1}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          >
                            Older →
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <FadeIn delay={0.1} duration={0.3}>
                      <div className="text-center py-16 sm:py-20">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                          No {activeTag !== 'all' ? activeTag : ''} readings found
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
