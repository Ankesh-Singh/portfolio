'use client'

import { useState, useMemo } from 'react'
import OnekoCat from '@/components/OnekoCat'
import { MasonryGrid } from '@/components/MasonryGrid'
import FadeIn from '@/components/FadeIn'
import DiagonalPattern from '@/components/DiagonalPattern'
import PageNavigation from '@/components/Navigation'
import { Design, DesignTag } from '@/types/design'
import { Project } from '@/types/project'

interface DesignListClientProps {
  designs: Design[]
}

const CATEGORIES: DesignTag[] = ['All', 'Hero', 'Sections', 'Waitlist']

export default function DesignListClient({ designs }: DesignListClientProps) {
  const [selectedTag, setSelectedTag] = useState<DesignTag>('All')

  const filteredDesigns = useMemo(() => {
    let filtered = designs;
    if (selectedTag !== 'All') {
      filtered = designs.filter(design => design.category === selectedTag)
    }
    
    // Map Design to Project to reuse MasonryGrid
    return filtered.map(d => ({
      id: d.id,
      title: d.title,
      description: d.description,
      image: d.image,
      tags: [],
      category: d.category,
      variationCount: d.variations?.length || 0,
    } as Project))
  }, [designs, selectedTag])

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
                    <h1 className="text-2xl sm:text-3xl font-[family-name:var(--font-instrument-serif)] italic font-medium mb-4 text-neutral-900 dark:text-neutral-100 tracking-tight">
                      designs & layouts
                    </h1>
                    <p className="text-lg text-neutral-500 dark:text-neutral-400 tracking-wide mb-8">
                      A showcase of my design work and UI components.
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {CATEGORIES.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSelectedTag(tag)}
                          className={`px-4 py-1.5 rounded-full text-sm transition-all duration-300 border ${
                            selectedTag === tag
                              ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white shadow-lg'
                              : 'bg-transparent text-neutral-500 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
              
              <div className="sm:px-12 py-2">
                <div className="px-4">
                  <MasonryGrid projects={filteredDesigns} key={selectedTag} hrefPrefix="/design" />
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
