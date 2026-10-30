"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { RotateCcw, Share2 } from 'lucide-react';
import { GameStatus, Player, Obstacle, Particle, GameTheme } from './types';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GROUND_OFFSET_BOTTOM,
  INITIAL_SPEED,
  MAX_SPEED,
  SPEED_ACCELERATION,
  GRAVITY,
  JUMP_FORCE,
  FAST_FALL_FORCE,
  BUNNY_WIDTH,
  BUNNY_HEIGHT,
  BUNNY_DUCK_HEIGHT,
  THEME_DARK,
  THEME_LIGHT,
} from './constants';
import { playJumpSound, playScoreSound, playGameOverSound, playCelebrationSound } from './audio';
import {
  drawGround,
  drawClouds,
  drawObstacle,
  drawPlayer,
  drawParticles,
} from './renderUtils';
import {
  checkCollision,
  spawnObstacle,
  getRandomObstacleDistance,
  createJumpDust,
  createGameOverParticles,
  createConfettiParticles,
  initClouds,
  initGroundDetails,
} from './physics';
import { ShareScoreModal } from './ShareScoreModal';
import { RunnerGameHud } from './RunnerGameHud';
import { RunnerGameControls } from './RunnerGameControls';

const LOCAL_HIGH_SCORE_KEY = 'runner_game_local_highscore';

interface SpriteAssets {
  initial: HTMLImageElement | null;
  justStarted: HTMLImageElement | null;
  r1: HTMLImageElement | null;
  r2: HTMLImageElement | null;
  hump: HTMLImageElement | null;
  dead: HTMLImageElement | null;
}

export function RunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [score, setScore] = useState(0);
  const [localHighScore, setLocalHighScore] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const spritesRef = useRef<SpriteAssets>({
    initial: null,
    justStarted: null,
    r1: null,
    r2: null,
    hump: null,
    dead: null,
  });

  const gameStateRef = useRef({
    status: 'idle' as GameStatus,
    speed: INITIAL_SPEED,
    score: 0,
    runFrames: 0,
    distanceSinceLastObstacle: 0,
    nextObstacleDistance: 320,
    groundY: CANVAS_HEIGHT - GROUND_OFFSET_BOTTOM,
    player: {
      x: 40,
      y: CANVAS_HEIGHT - GROUND_OFFSET_BOTTOM - BUNNY_HEIGHT,
      width: BUNNY_WIDTH,
      height: BUNNY_HEIGHT,
      originalHeight: BUNNY_HEIGHT,
      duckHeight: BUNNY_DUCK_HEIGHT,
      vy: 0,
      isJumping: false,
      isDucking: false,
      groundY: CANVAS_HEIGHT - GROUND_OFFSET_BOTTOM,
      rotation: 0,
    } as Player,
    obstacles: [] as Obstacle[],
    particles: [] as Particle[],
    clouds: initClouds(),
    groundDetails: initGroundDetails(CANVAS_HEIGHT - GROUND_OFFSET_BOTTOM),
    lastMilestone: 0,
    celebratedThisRun: false,
  });

  useEffect(() => {
    setMounted(true);
    const savedLocal = localStorage.getItem(LOCAL_HIGH_SCORE_KEY);
    if (savedLocal) setLocalHighScore(parseInt(savedLocal, 10) || 0);

    const loadImg = (src: string) => {
      const img = new Image();
      img.src = src;
      return img;
    };

    spritesRef.current = {
      initial: loadImg('/games/initial.webp'),
      justStarted: loadImg('/games/just_started.webp'),
      r1: loadImg('/games/r1.webp'),
      r2: loadImg('/games/r2.webp'),
      hump: loadImg('/games/hump.webp'),
      dead: loadImg('/games/dead.webp'),
    };
  }, []);

  const syncHighScore = useCallback((finalScore: number) => {
    if (finalScore > localHighScore) {
      setLocalHighScore(finalScore);
      localStorage.setItem(LOCAL_HIGH_SCORE_KEY, finalScore.toString());
      setHasCelebrated(true);
    }
  }, [localHighScore]);

  const startGame = useCallback(() => {
    const groundY = CANVAS_HEIGHT - GROUND_OFFSET_BOTTOM;
    const firstObstacle = spawnObstacle(groundY, INITIAL_SPEED);
    firstObstacle.x = CANVAS_WIDTH + 140;

    gameStateRef.current = {
      status: 'running',
      speed: INITIAL_SPEED,
      score: 0,
      runFrames: 0,
      distanceSinceLastObstacle: 0,
      nextObstacleDistance: 320,
      groundY,
      player: {
        x: 40,
        y: groundY - BUNNY_HEIGHT,
        width: BUNNY_WIDTH,
        height: BUNNY_HEIGHT,
        originalHeight: BUNNY_HEIGHT,
        duckHeight: BUNNY_DUCK_HEIGHT,
        vy: 0,
        isJumping: false,
        isDucking: false,
        groundY,
        rotation: 0,
      },
      obstacles: [firstObstacle],
      particles: [],
      clouds: initClouds(),
      groundDetails: initGroundDetails(groundY),
      lastMilestone: 0,
      celebratedThisRun: false,
    };

    setStatus('running');
    setScore(0);
    setHasCelebrated(false);
  }, []);

  const triggerJump = useCallback(() => {
    const state = gameStateRef.current;
    if (state.status === 'idle' || state.status === 'gameover') {
      startGame();
      return;
    }
    if (state.status === 'running' && !state.player.isJumping) {
      state.player.isJumping = true;
      state.player.vy = JUMP_FORCE;
      state.particles.push(...createJumpDust(state.player, state.groundY));
      playJumpSound(isMuted);
    }
  }, [startGame, isMuted]);

  const setDucking = useCallback((ducking: boolean) => {
    const state = gameStateRef.current;
    if (state.status !== 'running') return;
    const p = state.player;
    if (ducking) {
      p.isDucking = true;
      if (p.isJumping) p.vy += FAST_FALL_FORCE;
      else {
        p.height = p.duckHeight;
        p.y = state.groundY - p.duckHeight;
      }
    } else {
      p.isDucking = false;
      p.height = p.originalHeight;
      if (!p.isJumping) p.y = state.groundY - p.originalHeight;
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        triggerJump();
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        setDucking(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        setDucking(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [triggerJump, setDucking]);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const theme: GameTheme = resolvedTheme === 'dark' ? THEME_DARK : THEME_LIGHT;
    const sprites = spritesRef.current;

    const gameLoop = () => {
      const state = gameStateRef.current;

      if (state.status === 'running') {
        state.runFrames++;
        state.speed = Math.min(MAX_SPEED, state.speed + SPEED_ACCELERATION);
        state.score += 0.24;
        const currentFloor = Math.floor(state.score);

        if (localHighScore > 0 && currentFloor > localHighScore && !state.celebratedThisRun) {
          state.celebratedThisRun = true;
          setHasCelebrated(true);
          state.particles.push(...createConfettiParticles(state.player));
          playCelebrationSound(isMuted);
        }

        if (currentFloor > 0 && currentFloor % 100 === 0 && currentFloor !== state.lastMilestone) {
          state.lastMilestone = currentFloor;
          playScoreSound(isMuted);
        }

        const p = state.player;
        if (p.isJumping) {
          p.vy += GRAVITY;
          p.y += p.vy;
          p.rotation = Math.min(0.2, Math.max(-0.2, p.vy * 0.02));

          if (p.y >= state.groundY - p.height) {
            p.y = state.groundY - p.height;
            p.vy = 0;
            p.isJumping = false;
            p.rotation = 0;
            if (p.isDucking) p.height = p.duckHeight;
          }
        }

        for (const cloud of state.clouds) {
          cloud.x -= cloud.speed;
          if (cloud.x < -60) cloud.x = CANVAS_WIDTH + 60;
        }

        for (const dot of state.groundDetails) {
          dot.x -= state.speed;
          if (dot.x < -20) dot.x = CANVAS_WIDTH + Math.random() * 20;
        }

        state.distanceSinceLastObstacle += state.speed;
        if (state.distanceSinceLastObstacle >= state.nextObstacleDistance) {
          state.obstacles.push(spawnObstacle(state.groundY, state.speed));
          state.distanceSinceLastObstacle = 0;
          state.nextObstacleDistance = getRandomObstacleDistance();
        }

        for (let i = state.obstacles.length - 1; i >= 0; i--) {
          const obs = state.obstacles[i];
          obs.x -= state.speed;
          if (obs.wingFrame !== undefined) obs.wingFrame++;

          if (checkCollision(p, obs)) {
            state.status = 'gameover';
            setStatus('gameover');
            state.particles.push(...createGameOverParticles(p));
            playGameOverSound(isMuted);
            syncHighScore(currentFloor);
            break;
          }

          if (obs.x + obs.width < -50) state.obstacles.splice(i, 1);
        }

        for (let i = state.particles.length - 1; i >= 0; i--) {
          const part = state.particles[i];
          part.x += part.vx;
          part.y += part.vy;
          part.life++;
          part.alpha = Math.max(0, 1 - part.life / part.maxLife);
          if (part.life >= part.maxLife) state.particles.splice(i, 1);
        }

        setScore(currentFloor);
      }

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      drawClouds(ctx, state.clouds, theme);
      drawGround(ctx, state.groundY, state.groundDetails, theme);

      for (const obs of state.obstacles) drawObstacle(ctx, obs, theme);

      let activeSprite = sprites.initial;
      if (state.status === 'gameover') {
        activeSprite = sprites.dead;
      } else if (state.status === 'running') {
        if (state.player.isJumping) {
          activeSprite = sprites.hump;
        } else if (state.runFrames < 20) {
          activeSprite = sprites.justStarted;
        } else {
          const strideIndex = Math.floor(state.runFrames / 6) % 2;
          activeSprite = strideIndex === 0 ? sprites.r1 : sprites.r2;
        }
      }

      drawPlayer(ctx, state.player, activeSprite);
      drawParticles(ctx, state.particles);

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [mounted, resolvedTheme, isMuted, localHighScore, syncHighScore]);

  return (
    <div ref={containerRef} className="w-full relative select-none mt-6 pt-2 touch-manipulation">
      <RunnerGameHud
        localHighScore={localHighScore}
        score={score}
        status={status}
        hasCelebrated={hasCelebrated}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
      />

      <div
        className="relative w-full cursor-pointer group touch-none"
        onClick={triggerJump}
        onTouchStart={(e) => {
          if (status === 'running') {
            e.preventDefault();
            triggerJump();
          }
        }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="w-full h-auto block aspect-[1000/240] max-h-[260px] sm:max-h-[280px]"
        />

        {status === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-xs sm:text-sm font-mono text-neutral-400 dark:text-neutral-500 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors bg-neutral-100/80 dark:bg-zinc-800/80 px-4 py-1.5 rounded-full border border-neutral-200/50 dark:border-zinc-700/50 shadow-xs">
              Tap / Click to play bunny run
            </span>
          </div>
        )}

        {status === 'gameover' && (
          <div className="absolute inset-0 flex items-center justify-center gap-3 pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 dark:bg-zinc-900/90 text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm font-medium rounded-full shadow-lg border border-neutral-200 dark:border-zinc-800 hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
            >
              <RotateCcw size={15} className="text-lime-500" />
              <span>Play Again ({score} pts)</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsShareModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/90 dark:bg-zinc-900/90 text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm font-medium rounded-full shadow-lg border border-neutral-200 dark:border-zinc-800 hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
              title="Share your score"
            >
              <Share2 size={15} className="text-blue-500" />
              <span>Share</span>
            </button>
          </div>
        )}
      </div>

      {status === 'running' && (
        <RunnerGameControls
          onJump={triggerJump}
          onDuckStart={() => setDucking(true)}
          onDuckEnd={() => setDucking(false)}
        />
      )}

      <ShareScoreModal
        score={score}
        highScore={localHighScore}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
}
