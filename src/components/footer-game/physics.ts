import { Obstacle, ObstacleType, Particle, Player, Cloud, GroundDetail } from './types';
import {
  CANVAS_WIDTH,
  MIN_OBSTACLE_DISTANCE,
  MAX_OBSTACLE_DISTANCE,
} from './constants';

let lastSpawnedType: ObstacleType | null = null;
let secondLastSpawnedType: ObstacleType | null = null;

export function checkCollision(player: Player, obstacle: Obstacle): boolean {
  const paddingX = 10;
  const paddingY = 8;

  const playerBox = {
    left: player.x + paddingX,
    right: player.x + player.width - paddingX,
    top: player.y + paddingY,
    bottom: player.y + player.height,
  };

  const obstacleBox = {
    left: obstacle.x + 4,
    right: obstacle.x + obstacle.width - 4,
    top: obstacle.y + 4,
    bottom: obstacle.y + obstacle.height,
  };

  return (
    playerBox.left < obstacleBox.right &&
    playerBox.right > obstacleBox.left &&
    playerBox.top < obstacleBox.bottom &&
    playerBox.bottom > obstacleBox.top
  );
}

export function spawnObstacle(groundY: number, speed: number): Obstacle {
  const allowAir = speed > 8.5;
  const pool: ObstacleType[] = ['cactus-small', 'cactus-tall', 'cactus-group'];

  if (allowAir) {
    pool.push('bird-low', 'bird-high', 'bird-low');
  }

  // Filter out recent repeats to avoid obvious repeating patterns
  const candidatePool = pool.filter(
    (t) => !(t === lastSpawnedType && t === secondLastSpawnedType)
  );

  const finalPool = candidatePool.length > 0 ? candidatePool : pool;
  const type = finalPool[Math.floor(Math.random() * finalPool.length)];

  secondLastSpawnedType = lastSpawnedType;
  lastSpawnedType = type;

  // Add organic jitter to sizes and heights
  const heightJitter = Math.floor(Math.random() * 8) - 4;

  switch (type) {
    case 'cactus-small': {
      const h = 56 + heightJitter;
      return { x: CANVAS_WIDTH + 40, y: groundY - h, width: 34, height: h, type, passed: false };
    }
    case 'cactus-tall': {
      const h = 76 + heightJitter;
      return { x: CANVAS_WIDTH + 40, y: groundY - h, width: 38, height: h, type, passed: false };
    }
    case 'cactus-group': {
      const h = 64 + heightJitter;
      const w = 78 + Math.floor(Math.random() * 14);
      return { x: CANVAS_WIDTH + 40, y: groundY - h, width: w, height: h, type, passed: false };
    }
    case 'bird-low': {
      const birdAltitude = 65 + Math.floor(Math.random() * 16);
      return { x: CANVAS_WIDTH + 40, y: groundY - birdAltitude, width: 58, height: 40, type, passed: false, wingFrame: 0 };
    }
    case 'bird-high': {
      const birdAltitude = 105 + Math.floor(Math.random() * 18);
      return { x: CANVAS_WIDTH + 40, y: groundY - birdAltitude, width: 58, height: 40, type, passed: false, wingFrame: 0 };
    }
  }
}

export function getRandomObstacleDistance(): number {
  // Add rhythm variety: occasional quick obstacle pairs (clusters) vs longer open breathing spans
  const roll = Math.random();
  if (roll < 0.25) {
    // Tighter double obstacle gap
    return Math.random() * 80 + MIN_OBSTACLE_DISTANCE - 40;
  } else if (roll > 0.85) {
    // Generous breathing gap
    return MAX_OBSTACLE_DISTANCE + Math.random() * 90;
  }
  // Standard randomized distribution
  return Math.random() * (MAX_OBSTACLE_DISTANCE - MIN_OBSTACLE_DISTANCE) + MIN_OBSTACLE_DISTANCE;
}

export function createJumpDust(player: Player, groundY: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < 8; i++) {
    particles.push({
      x: player.x + player.width / 2 + (Math.random() * 24 - 12),
      y: groundY - 2,
      vx: -(Math.random() * 2.5 + 1),
      vy: -(Math.random() * 2),
      size: Math.random() * 4 + 2,
      alpha: 0.85,
      color: '#84cc16',
      life: 0,
      maxLife: 22,
    });
  }
  return particles;
}

export function createConfettiParticles(player: Player): Particle[] {
  const particles: Particle[] = [];
  const colors = ['#84cc16', '#38bdf8', '#f43f5e', '#fbbf24', '#a855f7', '#10b981'];
  for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 7 + 2;
    particles.push({
      x: player.x + player.width / 2,
      y: player.y + player.height / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      size: Math.random() * 5 + 3,
      alpha: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: 50,
    });
  }
  return particles;
}

export function createGameOverParticles(player: Player): Particle[] {
  const particles: Particle[] = [];
  const colors = ['#84cc16', '#e4e4e7', '#ef4444', '#facc15'];
  for (let i = 0; i < 30; i++) {
    const angle = (Math.PI * 2 * i) / 30;
    const speed = Math.random() * 5 + 2.5;
    particles.push({
      x: player.x + player.width / 2,
      y: player.y + player.height / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      size: Math.random() * 5 + 2.5,
      alpha: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: 40,
    });
  }
  return particles;
}

export function initClouds(): Cloud[] {
  return [
    { x: 160, y: 40, speed: 0.5, scale: 1.2 },
    { x: 680, y: 65, speed: 0.7, scale: 1.5 },
    { x: 1240, y: 35, speed: 0.4, scale: 1.1 },
  ];
}

export function initGroundDetails(groundY: number): GroundDetail[] {
  const details: GroundDetail[] = [];
  for (let x = 0; x < CANVAS_WIDTH; x += 32) {
    if (Math.random() > 0.35) {
      details.push({
        x,
        y: groundY + Math.floor(Math.random() * 18) + 5,
        width: Math.floor(Math.random() * 10) + 4,
      });
    }
  }
  return details;
}
