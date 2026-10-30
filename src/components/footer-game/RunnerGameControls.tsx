"use client";

import { ArrowUp, ArrowDown } from 'lucide-react';

interface RunnerGameControlsProps {
  onJump: () => void;
  onDuckStart: () => void;
  onDuckEnd: () => void;
}

export function RunnerGameControls({
  onJump,
  onDuckStart,
  onDuckEnd,
}: RunnerGameControlsProps) {
  return (
    <div className="flex sm:hidden items-center justify-center gap-3 mt-2">
      <button
        type="button"
        onTouchStart={(e) => {
          e.preventDefault();
          onJump();
        }}
        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white/80 dark:bg-zinc-900/80 text-neutral-800 dark:text-zinc-200 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-zinc-800 shadow-sm active:scale-95 transition-transform backdrop-blur-xs"
      >
        <ArrowUp size={14} /> JUMP
      </button>
      <button
        type="button"
        onTouchStart={(e) => {
          e.preventDefault();
          onDuckStart();
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          onDuckEnd();
        }}
        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white/80 dark:bg-zinc-900/80 text-neutral-800 dark:text-zinc-200 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-zinc-800 shadow-sm active:scale-95 transition-transform backdrop-blur-xs"
      >
        <ArrowDown size={14} /> DUCK
      </button>
    </div>
  );
}
