'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { BANNER_VIDEOS } from '@/lib/asset'

interface BannerSectionProps {
  quote?: string
  bannerImage?: string
}

export default function BannerSection({ 
  quote = "Luck is what happens when preparation meets persistence.",
  bannerImage,
}: BannerSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Rotating logic every 1 minute
  useEffect(() => {
    if (bannerImage) return // Don't rotate if a specific image is provided

    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNER_VIDEOS.length)
    }, 60000)

    return () => clearInterval(intervalId)
  }, [bannerImage])

  const currentAsset = bannerImage || BANNER_VIDEOS[currentIndex]
  const isVideo = currentAsset.toLowerCase().endsWith('.mp4') || currentAsset.toLowerCase().endsWith('.webm')

  return (
    <div className="w-full mb-2 relative">
      {/* Preloading other videos to avoid buffering during switch */}
      {BANNER_VIDEOS.map((url) => (
        <link key={url} rel="preload" as="video" href={url} />
      ))}
      <div className="relative overflow-hidden h-[180px] sm:h-[270px]">
        {isVideo ? (
          <video
            key={currentAsset} // Key helps reload the transition between videos
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            src={currentAsset}
          />
        ) : (
          <Image 
            alt="Banner" 
            width={1240} 
            height={900} 
            className="w-full h-full object-cover" 
            src={currentAsset}
            style={{ color: 'transparent', minHeight: '100px' }}
            priority
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center px-4 bg-black/20">
          <p className="text-white text-base sm:text-xl italic font-[family-name:var(--font-instrument-serif)] text-center drop-shadow-md">{quote}</p>
        </div>
      </div>
    </div>
  )
}
