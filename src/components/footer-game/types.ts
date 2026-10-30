export type GameStatus = 'idle' | 'running' | 'gameover' | 'paused';

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  originalHeight: number;
  duckHeight: number;
  vy: number;
  isJumping: boolean;
  isDucking: boolean;
  groundY: number;
  rotation: number;
}

export type ObstacleType = 'cactus-small' | 'cactus-tall' | 'cactus-group' | 'bird-low' | 'bird-high';

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: ObstacleType;
  passed: boolean;
  wingFrame?: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface Cloud {
  x: number;
  y: number;
  speed: number;
  scale: number;
}

export interface GroundDetail {
  x: number;
  y: number;
  width: number;
}

export interface GameTheme {
  isDark: boolean;
  background: string;
  groundColor: string;
  textColor: string;
  accentColor: string;
  obstacleColor: string;
  cloudColor: string;
}
