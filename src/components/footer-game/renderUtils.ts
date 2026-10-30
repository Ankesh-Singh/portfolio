import { Obstacle, Particle, Cloud, GroundDetail, GameTheme, Player } from './types';
import { CANVAS_WIDTH } from './constants';

export function drawGround(
  ctx: CanvasRenderingContext2D,
  groundY: number,
  details: GroundDetail[],
  theme: GameTheme
) {
  ctx.strokeStyle = theme.groundColor;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(CANVAS_WIDTH, groundY);
  ctx.stroke();

  ctx.fillStyle = theme.groundColor;
  for (const dot of details) {
    ctx.fillRect(dot.x, dot.y, dot.width, 3);
  }
}

export function drawClouds(
  ctx: CanvasRenderingContext2D,
  clouds: Cloud[],
  theme: GameTheme
) {
  ctx.fillStyle = theme.cloudColor;
  for (const cloud of clouds) {
    ctx.save();
    ctx.translate(cloud.x, cloud.y);
    ctx.scale(cloud.scale, cloud.scale);
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.arc(14, -10, 14, 0, Math.PI * 2);
    ctx.arc(30, 0, 16, 0, Math.PI * 2);
    ctx.rect(-14, 0, 58, 14);
    ctx.fill();
    ctx.restore();
  }
}

export function drawObstacle(
  ctx: CanvasRenderingContext2D,
  obstacle: Obstacle,
  theme: GameTheme
) {
  ctx.save();
  ctx.fillStyle = obstacle.type.startsWith('bird') ? theme.accentColor : theme.obstacleColor;

  if (obstacle.type === 'cactus-small' || obstacle.type === 'cactus-tall') {
    const radius = 6;
    ctx.beginPath();
    ctx.roundRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height, [radius, radius, 0, 0]);
    ctx.fill();

    // Side arms
    const armY = obstacle.y + obstacle.height * 0.35;
    const armH = 7;
    ctx.fillRect(obstacle.x - 9, armY, obstacle.width + 18, armH);
    ctx.fillRect(obstacle.x - 9, armY - 12, 7, 14);
    ctx.fillRect(obstacle.x + obstacle.width + 2, armY - 14, 7, 16);
  } else if (obstacle.type === 'cactus-group') {
    ctx.beginPath();
    ctx.roundRect(obstacle.x, obstacle.y + 14, 22, obstacle.height - 14, [5, 5, 0, 0]);
    ctx.roundRect(obstacle.x + 28, obstacle.y, 28, obstacle.height, [6, 6, 0, 0]);
    ctx.roundRect(obstacle.x + 60, obstacle.y + 18, 24, obstacle.height - 18, [5, 5, 0, 0]);
    ctx.fill();
  } else if (obstacle.type.startsWith('bird')) {
    const isWingUp = (obstacle.wingFrame ?? 0) % 20 < 10;
    const centerX = obstacle.x + obstacle.width / 2;
    const centerY = obstacle.y + obstacle.height / 2;

    // Body
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, 22, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(obstacle.x + 10, centerY - 4, 8, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.beginPath();
    ctx.moveTo(obstacle.x + 4, centerY - 3);
    ctx.lineTo(obstacle.x - 8, centerY);
    ctx.lineTo(obstacle.x + 4, centerY + 4);
    ctx.fill();

    // Wings
    ctx.beginPath();
    if (isWingUp) {
      ctx.moveTo(obstacle.x + 18, centerY);
      ctx.lineTo(obstacle.x + 32, centerY - 16);
      ctx.lineTo(obstacle.x + 42, centerY);
    } else {
      ctx.moveTo(obstacle.x + 18, centerY);
      ctx.lineTo(obstacle.x + 32, centerY + 18);
      ctx.lineTo(obstacle.x + 42, centerY);
    }
    ctx.fill();
  }
  ctx.restore();
}

export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  player: Player,
  image: HTMLImageElement | null
) {
  ctx.save();
  ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
  ctx.rotate(player.rotation);

  if (image && image.complete && image.naturalWidth > 0) {
    ctx.drawImage(
      image,
      -player.width / 2,
      -player.height / 2,
      player.width,
      player.height
    );
  } else {
    ctx.fillStyle = '#84cc16';
    ctx.beginPath();
    ctx.roundRect(-player.width / 2, -player.height / 2, player.width, player.height, 10);
    ctx.fill();
  }
  ctx.restore();
}

export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const p of particles) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
