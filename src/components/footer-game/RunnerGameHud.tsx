"use client";

import { Trophy, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { GameStatus } from './types';

interface RunnerGameHudProps {
  localHighScore: number;
  score: number;
  status: GameStatus;
  hasCelebrated: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function RunnerGameHud({
  localHighScore,
  score,
  status,
  hasCelebrated,
  isMuted,
  onToggleMute,
}: RunnerGameHudProps) {
  return (
    <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-neutral-500 dark:text-neutral-400 mb-2 px-1">
      <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
        <span className="flex items-center gap-1.5">
          <Trophy size={14} className="text-amber-500" />
          BEST <strong className="text-neutral-900 dark:text-neutral-100 tabular-nums">{String(localHighScore).padStart(5, '0')}</strong>
        </span>
        {status === 'running' && (
          <span className="text-lime-600 dark:text-lime-400 font-bold tabular-nums">
            SCORE {String(score).padStart(5, '0')}
          </span>
        )}
        {hasCelebrated && (
          <span className="inline-flex items-center gap-1 text-xs text-lime-600 dark:text-lime-400 font-semibold animate-pulse">
            <Sparkles size={13} /> NEW RECORD!
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={onToggleMute}
        className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </div>
  );
}
