'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Reveal } from './Reveal';
import SectionBorder from './SectionBorder';
import NeumorphButton from './NeumorphButton';
// import BlogCardDB from './cards/BlogCard';
import ReadingCard from './cards/ReadingCard';
import type { Post } from '@/lib/posts';

function usePosts(type: 'blog' | 'reading' | 'thought', limit: number) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts?type=${type}&limit=${limit}`)
      .then(r => r.json())
      .then(data => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [type, limit]);

  return { posts, loading };
}

export default function DynamicContentSections() {
  // const { posts: blogs, loading: blogsLoading } = usePosts('blog', 3);
  const { posts: readings, loading: readingsLoading } = usePosts('reading', 2);
  const { posts: thoughts, loading: thoughtsLoading } = usePosts('thought', 3);

  return (
    <>
      {/* Blogs Section (Disabled/Commented out for now - uncomment when ready) */}
      {/*
      <Reveal delay={0.1}>
        <div className="sm:px-12 py-2">
          <div className="px-4 mb-4 sm:mb-6 mt-4 sm:mt-6 flex items-center gap-2 sm:gap-3 flex-wrap text-base sm:text-xl font-[family-name:var(--font-instrument-serif)]">
            <h2 className="opacity-20">Blogs</h2>
          </div>
          <div className="px-4">
            {blogsLoading ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-wide py-4">Loading...</p>
            ) : blogs.length > 0 ? (
              <div className="flex flex-col gap-3">
                {blogs.slice(0, 3).map(blog => (
                  <BlogCardDB key={blog.id} {...blog} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 py-4">No blogs yet.</p>
            )}
          </div>
          <div className="px-4 flex justify-center mt-6 sm:mt-8 mb-4 sm:mb-6">
            <Link href="/blogs">
              <NeumorphButton className="inline-flex items-center gap-1 px-4 py-2 text-xs sm:text-sm text-neutral-800 dark:text-white/80 hover:text-neutral-900 dark:hover:text-white">
                <span>View All</span><span>→</span>
              </NeumorphButton>
            </Link>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <SectionBorder className="mt-0 pt-0" />
      </Reveal>
      */}

      {/* My Readings Section */}
      <Reveal delay={0.1}>
        <div className="sm:px-12 py-2">
          <div className="px-4 mb-4 sm:mb-6 mt-4 sm:mt-6">
            <h2 className="text-base sm:text-xl opacity-20 font-[family-name:var(--font-instrument-serif)]">My Reading</h2>
          </div>
          <div className="px-4">
            {readingsLoading ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-wide py-4">Loading...</p>
            ) : readings.length > 0 ? (
              <div className="flex flex-col gap-3">
                {readings.slice(0, 2).map(reading => (
                  <ReadingCard key={reading.id} {...reading} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 py-4">No readings yet.</p>
            )}
          </div>
          <div className="px-4 flex justify-center mt-6 sm:mt-8 mb-4 sm:mb-6">
            <Link href="/readings">
              <NeumorphButton className="inline-flex items-center gap-1 px-4 py-2 text-xs sm:text-sm text-neutral-800 dark:text-white/80 hover:text-neutral-900 dark:hover:text-white">
                <span>View All</span><span>→</span>
              </NeumorphButton>
            </Link>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <SectionBorder className="mt-0 pt-0" />
      </Reveal>

      {/* Thoughts Section */}
      <Reveal delay={0.1}>
        <div className="sm:px-12 py-2">
          <div className="px-4 mb-4 sm:mb-6 mt-4 sm:mt-6">
            <h2 className="text-base sm:text-xl opacity-20 font-[family-name:var(--font-instrument-serif)]">Thoughts</h2>
          </div>
          <div className="px-4">
            {thoughtsLoading ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-wide py-4">Loading...</p>
            ) : thoughts.length > 0 ? (
              <div className="space-y-1">
                 {thoughts.slice(0, 3).map((thought, idx) => (
                    <div key={thought.id} className="flex gap-3 items-start py-1">
                      <span className="shrink-0 text-sm font-mono text-neutral-400 dark:text-neutral-500 w-5 text-right select-none mt-0.5">
                        {idx + 1}.
                      </span>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                        {thought.notes || '—'}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 py-4">No thoughts yet.</p>
            )}
          </div>
          <div className="px-4 flex justify-center mt-6 sm:mt-8 mb-4 sm:mb-6">
            <Link href="/thoughts">
              <NeumorphButton className="inline-flex items-center gap-1 px-4 py-2 text-xs sm:text-sm text-neutral-800 dark:text-white/80 hover:text-neutral-900 dark:hover:text-white">
                <span>View All</span><span>→</span>
              </NeumorphButton>
            </Link>
          </div>
        </div>
      </Reveal>
    </>
  );
}
