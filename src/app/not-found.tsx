import Link from 'next/link'
import DiagonalPattern from '@/components/DiagonalPattern'
import OnekoCat from '@/components/OnekoCat'
import NeumorphButton from '@/components/NeumorphButton'
import PageNavigation from '@/components/Navigation'

export default function NotFound() {
  return (
    <div
      className="min-h-screen transition-colors duration-300 relative flex flex-col justify-between"
      style={{ fontFamily: 'var(--font-hk-grotesk)' }}
    >
      <OnekoCat />

      <div className="relative mx-auto max-w-4xl w-full flex-1 flex flex-col">
        {/* Diagonal side borders matching portfolio */}
        <DiagonalPattern side="left" topOffset="0" />
        <DiagonalPattern side="right" topOffset="0" />

        <div className="mx-auto sm:w-[calc(100%-120px)] w-full max-w-4xl px-4 sm:px-0 flex-1 flex flex-col">
          {/* Top navigation */}
          <div className="pt-6 pb-2">
            <PageNavigation />
          </div>

          {/* Centered 404 Hero Content */}
          <div className="flex-1 flex flex-col items-center justify-center text-center py-13 sm:py-24">
            {/* Status indicator pill */}
           
            {/* Serif Heading */}
            <h1 className="text-6xl sm:text-8xl font-[family-name:var(--font-instrument-serif)] italic font-medium text-neutral-900 dark:text-neutral-100 tracking-tight mb-4">
              Lost in space
            </h1>

            {/* Subtext */}
            <p className="max-w-md text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
             Let&apos;s get you back to familiar territory.
            </p>

            {/* Call to action */}
            <Link href="/" className="inline-block">
              <NeumorphButton className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-neutral-800 dark:text-white/90 hover:text-neutral-950 dark:hover:text-white">
                <span>← Return to Home</span>
              </NeumorphButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
