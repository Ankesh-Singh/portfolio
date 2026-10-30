'use client'

import { certificates } from '@/data/certicate'
import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from './Reveal'

export default function CertificateSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {certificates.map((cert, index) => (
        <Reveal key={cert.title} delay={index * 0.05}>
          <Link 
            href={cert.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-300 bg-white/50 dark:bg-black/20"
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-10 h-10 rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-1">
                <Image 
                  src={cert.logoUrl} 
                  alt={cert.Issued} 
                  width={40} 
                  height={40} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate group-hover:text-blue-500 transition-colors">
                  {cert.title}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
                    {cert.Issued}
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    {cert.date}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  )
}
