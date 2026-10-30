export const CANVAS_WIDTH = 1660;
export const CANVAS_HEIGHT = 280;
export const GROUND_OFFSET_BOTTOM = 32;

export const INITIAL_SPEED = 9.8;
export const MAX_SPEED = 18.5;
export const SPEED_ACCELERATION = 0.0016;

export const GRAVITY = 1.35;
export const JUMP_FORCE = -18.2;
export const FAST_FALL_FORCE = 2.4;

export const BUNNY_WIDTH = 54;
export const BUNNY_HEIGHT = 68;
export const BUNNY_DUCK_HEIGHT = 40;

export const MIN_OBSTACLE_DISTANCE = 260;
export const MAX_OBSTACLE_DISTANCE = 540;

export const THEME_DARK = {
  isDark: true,
  background: 'transparent',
  groundColor: '#3f3f46',
  textColor: '#a1a1aa',
  accentColor: '#84cc16',
  obstacleColor: '#71717a',
  cloudColor: 'rgba(255, 255, 255, 0.05)',
};

export const THEME_LIGHT = {
  isDark: false,
  background: 'transparent',
  groundColor: '#e5e7eb',
  textColor: '#71717a',
  accentColor: '#65a30d',
  obstacleColor: '#9ca3af',
  cloudColor: 'rgba(0, 0, 0, 0.04)',
};
