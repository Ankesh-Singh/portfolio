'use client';

import { Project } from '@/types/project'
import Link from "next/link";
import Image from "next/image";
// import Video from "next-video";
import { useState } from 'react';
interface MasonryProjectCardProps {
  project: Project;
  className?: string;
  hrefPrefix?: string;
}


export const MasonryProjectCard = ({ project, className = "", hrefPrefix = "/projects" }: MasonryProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoSource = project.video || null;

  return (
    <Link 
      href={`${hrefPrefix}/${project.id}`} 
      className="group/item block w-full touch-manipulation"
      style={{ 
        WebkitTapHighlightColor: 'transparent',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`flex flex-col gap-3 w-full p-1 bg-white dark:bg-white/10 border border-black/10 dark:border-white/5 rounded-[10px] transition-all duration-300 ease-out group-has-hover:opacity-40 group-has-hover:group-hover/item:opacity-100 group-has-hover:group-hover/item:border-black/20 group-has-hover:group-hover/item:dark:border-white/10 group-has-hover:group-hover/item:scale-[1.02] group-has-hover:group-hover/item:shadow-lg group-has-hover:group-hover/item:shadow-black/5 dark:group-has-hover:group-hover/item:shadow-black/20 ${className}`}
      >
        <div className="relative overflow-hidden rounded-md w-full aspect-video bg-black/10 dark:bg-white/10 border border-black/5 dark:border-white/5 transition-all duration-300 group-has-hover:group-hover/item:border-black/10 dark:group-has-hover:group-hover/item:border-white/10">
          {videoSource && isHovered ? (
            <video
              key={project.id}
              src={videoSource}
              poster={project.image}
              className="w-full h-full rounded-md object-cover transition-transform duration-300 group-has-hover:group-hover/item:scale-105"
              playsInline
              autoPlay
              muted
              loop
            />
          ) : project.image ? (
            <Image
              src={project.image}
              alt={`${project.title} project cover`}
              width={1200}
              height={675}
              className="rounded-md w-full h-full object-cover transition-transform duration-300 group-has-hover:group-hover/item:scale-105"
              style={{ color: 'transparent' }}
              sizes="(max-width: 640px) 384px, (max-width: 768px) 50vw, (max-width: 1024px) 50vw, 317px"
              quality={75}
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cyan-400/20 via-blue-500/20 to-purple-600/20 rounded-md transition-transform duration-300 group-has-hover:group-hover/item:scale-105" />
          )}
        </div>
        
        <div className="w-full px-2 pb-4 flex justify-between items-center">
          <span className="text-[15px] leading-7 text-black/80 group-has-hover:hover:text-black dark:text-white/80 dark:group-has-hover:hover:text-white font-medium transition-colors duration-300">
            {project.title}
          </span>
          {!!project.variationCount && project.variationCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full border border-black/10 dark:border-white/10 text-neutral-500 bg-black/5 dark:bg-white/5">
              {project.variationCount} {project.variationCount === 1 ? 'variation' : 'variations'}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
