'use client'

import Image from 'next/image'
import OnekoCat from '@/components/OnekoCat'
import FadeIn from '@/components/FadeIn'
import { FadeInUp } from '@/components/ui/PageTransitions'
import DiagonalPattern from '@/components/DiagonalPattern'
import PageNavigation from '@/components/Navigation'
import { ExternalLink } from 'lucide-react'
import type { Post } from '@/lib/posts'

interface ThoughtDetailClientProps {
  post: Post;
}

export default function ThoughtDetailClient({ post }: ThoughtDetailClientProps) {
  const banner = post.banner_url;

  const handleUrlClick = () => {
    fetch(`/api/posts/${post.id}/click`, { method: 'POST' }).catch(console.error);
    if (post.url) {
      window.open(post.url, '_blank');
    }
  };

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
                    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
                      {banner && (
                        <div className="relative h-64 sm:h-96 w-full bg-zinc-800">
                          <Image 
                            src={banner} 
                            alt={post.title || 'Thought'} 
                            fill 
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-8 space-y-6">
                        {post.title && <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{post.title}</h2>}
                        
                        {post.url && (
                          <button 
                            onClick={handleUrlClick}
                            className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors font-medium"
                          >
                            <ExternalLink size={16} /> Open Link
                          </button>
                        )}
                        
                        <div className="prose prose-invert prose-zinc max-w-none mt-6">
                          {post.notes ? (
                            <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{post.notes}</p>
                          ) : (
                            <p className="text-zinc-500 italic">No notes provided.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInUp>
              <div className="pb-16 sm:pb-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
