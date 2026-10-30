'use client'

import Link from "next/link"
import OnekoCat from "@/components/OnekoCat"
import { ModeToggle } from '@/components/theme-toggle'
import NeumorphButton from '@/components/NeumorphButton'

export default function BlogNotFoundClient() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
      <OnekoCat />
      <div className="flex justify-end p-4 absolute top-0 right-0">
        <ModeToggle />
      </div>
      <div className="text-center w-full max-w-md mx-auto">
        <h2 className="text-2xl sm:text-3xl font-medium mb-3 sm:mb-4">Blog Post Not Found</h2>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mb-6 sm:mb-8">
          The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link href="/blogs" className="inline-block">
          <NeumorphButton className="inline-flex items-center gap-1 px-4 py-2 text-xs sm:text-sm text-neutral-800 dark:text-white/80 hover:text-neutral-900 dark:hover:text-white cursor-pointer">
            <span>← Back to Blog</span>
          </NeumorphButton>
        </Link>
      </div>
    </div>
  )
} 