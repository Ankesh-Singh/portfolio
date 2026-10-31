import { FaPaperclip } from "react-icons/fa6";
import * as React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import PortfolioStars from './PortfolioStars';
import NeumorphButton from "./NeumorphButton";
import Image from "next/image";

interface ProfileHeaderProps {
  name?: string
  age?: string
  title?: string
  profileImage?: string
  socialLinks?: {
    twitter?: string
    resume?: string
    linkedin?: string
    github?: string
    LeetCode?: string
    Substack?: string
  }
}

export default function ProfileHeader({
  name = "Ankesh Singh",
  age = "21",
  title = "engineer • developer • builder",
  profileImage = "/p1.jpg",
  socialLinks = {
    twitter: "",
    github: "https://github.com/Ankesh-Singh",
    linkedin: "https://www.linkedin.com/in/ankeshsingh07/",
    resume: "https://drive.google.com/file/d/1sU-CHnUOCgSduOY-VIBuLobFIPO9uEJl/view",
    LeetCode: "https://leetcode.com/u/Ethan038/",
  }
}: ProfileHeaderProps) {
  return (
    <div className="flex-col -mt-10">
      <div className="flex items-center justify-between mb-4 sm:ml-8 ml-4 sm:mr-8 mr-4">
        <div
          className="w-24 h-24 sm:w-28 sm:h-28 relative z-10 rounded-full overflow-hidden bg-cover bg-center shrink-0"
          role="img"
          aria-label={name}
          style={{ backgroundImage: `url("${profileImage}")` }}
        />
        <PortfolioStars />
      </div>
      <div className="text-left sm:flex sm:justify-between sm:items-center w-full sm:px-8 px-4 flex-col sm:flex-row">
        <div className="px-0">
          <h1 className="font-[family-name:var(--font-instrument-serif)] italic text-2xl sm:text-4xl tracking-[0.01em] font-medium mb-0">
            {name}
          </h1>
          <p className="opacity-40 text-xs sm:text-sm">
            {age} • {title}
          </p>
        </div>
        <div className="flex justify-start gap-1 sm:gap-2 mt-3 sm:mt-0 px-0">
          {socialLinks.github && (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  className="touch-manipulation active:opacity-75 flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8"
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none'
                  }}
                >
                  <NeumorphButton className="flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8 rounded-full overflow-hidden">
                    <Image
                      src="/logo/github.svg"
                      alt="GitHub"
                      width={16}
                      height={16}
                      className="object-contain dark:invert dark:opacity-85"
                    />
                  </NeumorphButton>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                GitHub
              </TooltipContent>
            </Tooltip>
          )}
          {socialLinks.twitter && (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  className="touch-manipulation active:opacity-75 flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8"
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none'
                  }}
                >
                  <NeumorphButton className="flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8 rounded-full overflow-hidden">
                    <Image
                      src="/logo/x-company-solid.svg"
                      alt="Twitter"
                      width={14}
                      height={14}
                      className="object-contain dark:invert dark:opacity-85"
                    />
                  </NeumorphButton>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                Twitter
              </TooltipContent>
            </Tooltip>
          )}
          {socialLinks.linkedin && (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  className="touch-manipulation active:opacity-75 flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8"
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none'
                  }}
                >
                  <NeumorphButton className="flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8 rounded-full overflow-hidden">
                    <Image
                      src="/logo/linkedin.svg"
                      alt="LinkedIn"
                      width={16}
                      height={16}
                      className="object-contain"
                    />
                  </NeumorphButton>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                LinkedIn
              </TooltipContent>
            </Tooltip>
          )}
          {socialLinks.LeetCode && (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  className="touch-manipulation active:opacity-75 flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8"
                  href={socialLinks.LeetCode}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none'
                  }}
                >
                  <NeumorphButton className="flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8 rounded-full overflow-hidden">
                    <Image
                      src="/leetcode.png"
                      alt="LeetCode"
                      width={18}
                      height={18}
                      className="object-contain"
                    />
                  </NeumorphButton>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                LeetCode
              </TooltipContent>
            </Tooltip>
          )}
          {socialLinks.resume && (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  className="touch-manipulation active:opacity-75 flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8"
                  href={socialLinks.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none'
                  }}
                >
                  <NeumorphButton className="flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8 rounded-full">
                    <FaPaperclip className="text-[16px] sm:text-[16px] text-black/75 dark:text-white/80" />
                  </NeumorphButton>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                Resume
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  )
}
