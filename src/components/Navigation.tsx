'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import * as React from 'react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

function getBackConfig(pathname: string): { href: string; label: string } | null {
  if (pathname === '/' || pathname === '/projects' || pathname === '/blogs' || pathname === '/sponsors') {
    return null
  }
  if (pathname.startsWith('/reading/')) {
    return { href: '/readings', label: 'Back to Readings' }
  }
  if (pathname.startsWith('/readings')) {
    return { href: '/', label: 'Back to Home' }
  }
  if (pathname.startsWith('/thoughts')) {
    return { href: '/', label: 'Back to Home' }
  }
  if (pathname.startsWith('/blogs')) {
    return { href: '/', label: 'Back to Home' }
  }
  if (pathname.startsWith('/projects/')) {
    return { href: '/projects', label: 'Back to Projects' }
  }
  // Default fallback
  return { href: '/projects', label: 'Back to Projects' }
}

const BackArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-[14px] -mt-px -ml-0.5">
    <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
    <path d="M9 14 4 9l5-5"></path>
  </svg>
)

export default function PageNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const back = getBackConfig(pathname)

  const handleBack = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(href)
    }
  }

  return (
    <section className="flex items-center justify-between w-full will-change-transform" style={{ opacity: 1, filter: 'blur(0px)', transform: 'none' }}>
      <div className="flex items-center gap-0.5 p-0.5 bg-black/5 dark:bg-white/10 rounded-full h-[32px]">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-7 h-7 bg-transparent has-hover:hover:bg-black/5 dark:has-hover:hover:bg-white/10 transition-[colors] duration-200 rounded-full flex items-center justify-center text-black/75 dark:text-white/80" tabIndex={0} style={{ transform: 'none' }}>
              <Link href="/">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18px" height="18px" viewBox="0 0 18 18" className="size-[13px] -mt-px -ml-0.5">
                  <path d="M13.75 6.019C13.336 6.019 13 5.683 13 5.269V2.75C13 2.336 13.336 2 13.75 2C14.164 2 14.5 2.336 14.5 2.75V5.269C14.5 5.683 14.164 6.019 13.75 6.019Z" fill="currentColor" data-color="color-2"></path>
                  <path fillRule="evenodd" clipRule="evenodd" d="M15.792 5.848L9.446 1.147C9.181 0.951 8.818 0.951 8.553 1.147L2.208 5.848C1.764 6.177 1.5 6.702 1.5 7.254V13.75C1.5 15.267 2.733 16.5 4.25 16.5H5.5V12.75C5.5 11.7835 6.2835 11 7.25 11C8.2165 11 9 11.7835 9 12.75V16.5H13.75C15.267 16.5 16.5 15.267 16.5 13.75V7.254C16.5 6.702 16.235 6.176 15.792 5.848ZM11.25 10.5H12.75C13.164 10.5 13.5 10.164 13.5 9.75C13.5 9.336 13.164 9 12.75 9H11.25C10.836 9 10.5 9.336 10.5 9.75C10.5 10.164 10.836 10.5 11.25 10.5Z" fill="currentColor"></path>
                </svg>
              </Link>
            </div>
          </TooltipTrigger>
          <TooltipContent>Home</TooltipContent>
        </Tooltip>

        {back && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="w-7 h-7 bg-transparent has-hover:hover:bg-black/5 dark:has-hover:hover:bg-white/10 transition-[colors] duration-200 rounded-full flex items-center justify-center text-black/75 dark:text-white/80 cursor-pointer"
                tabIndex={0}
                style={{ transform: 'none' }}
                onClick={(e) => handleBack(e, back.href)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleBack(e as unknown as React.MouseEvent, back.href) }}
              >
                <BackArrowIcon />
              </div>
            </TooltipTrigger>
            <TooltipContent>{back.label}</TooltipContent>
          </Tooltip>
        )}
      </div>
    </section>
  )
}
