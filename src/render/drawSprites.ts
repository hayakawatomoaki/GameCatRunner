import type { Enemy, Obstacle } from '../game/types';

export function drawCat(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, dead: boolean): void {
  const px = Math.round(x);
  const py = Math.round(y);
  if (dead) {
    ctx.fillStyle = '#ff8800';
    ctx.fillRect(px, py + 20, 36, 14);
    ctx.fillStyle = '#ffaa33';
    ctx.fillRect(px + 20, py + 10, 18, 18);
    ctx.fillRect(px + 20, py + 4, 6, 8);
    ctx.fillRect(px + 32, py + 4, 6, 8);
    ctx.fillStyle = '#ff3333';
    ctx.fillText('x', px + 24, py + 22);
    ctx.fillStyle = '#ff8800';
    ctx.fillRect(px, py + 14, 6, 12);
    return;
  }

  const lo = frame % 4 < 2 ? 2 : -2;
  ctx.fillStyle = '#ff8800';
  ctx.fillRect(px + 2, py + 14, 28, 16);
  ctx.fillStyle = '#ffaa33';
  ctx.fillRect(px + 18, py + 2, 18, 18);
  ctx.fillStyle = '#ff8800';
  ctx.fillRect(px + 18, py - 4, 5, 8);
  ctx.fillRect(px + 31, py - 4, 5, 8);
  ctx.fillStyle = '#ffccaa';
  ctx.fillRect(px + 20, py - 2, 3, 5);
  ctx.fillRect(px + 33, py - 2, 3, 5);
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(px + 22, py + 7, 3, 3);
  ctx.fillRect(px + 29, py + 7, 3, 3);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(px + 23, py + 7, 1, 1);
  ctx.fillRect(px + 30, py + 7, 1, 1);
  ctx.fillStyle = '#ff6699';
  ctx.fillRect(px + 25, py + 12, 3, 2);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(px + 18, py + 11, 8, 1);
  ctx.fillRect(px + 18, py + 13, 8, 1);
  ctx.fillRect(px + 35, py + 11, 6, 1);
  ctx.fillRect(px + 35, py + 13, 6, 1);
  ctx.fillStyle = '#cc6600';
  ctx.fillRect(px + 6, py + 16, 3, 10);
  ctx.fillRect(px + 12, py + 16, 3, 10);
  ctx.fillStyle = '#ff8800';
  if (frame % 4 < 2) {
    ctx.fillRect(px - 4, py + 10, 8, 4);
    ctx.fillRect(px - 2, py + 6, 4, 6);
  } else {
    ctx.fillRect(px - 4, py + 14, 8, 4);
    ctx.fillRect(px - 2, py + 10, 4, 6);
  }
  ctx.fillRect(px + 20, py + 28, 5, 6 + lo);
  ctx.fillRect(px + 27, py + 28, 5, 6 - lo);
  ctx.fillRect(px + 4, py + 28, 5, 6 - lo);
  ctx.fillRect(px + 11, py + 28, 5, 6 + lo);
  ctx.fillStyle = '#ffccaa';
  ctx.fillRect(px + 19, py + 33 + lo, 7, 3);
  ctx.fillRect(px + 26, py + 33 - lo, 7, 3);
  ctx.fillRect(px + 3, py + 33 - lo, 7, 3);
  ctx.fillRect(px + 10, py + 33 + lo, 7, 3);
}

export function drawEnemy(ctx: CanvasRenderingContext2D, e: Enemy, frameCount: number): void {
  const t = e.type;
  const px = Math.round(e.x);
  const py = Math.round(e.y);
  const lf = e.frame % 4 < 2 ? 2 : -2;
  ctx.fillStyle = t.headColor;
  const hs = Math.floor(t.w * 0.6);
  const hx = px + Math.floor((t.w - hs) / 2);
  ctx.fillRect(hx, py, hs, hs);
  ctx.fillStyle = '#333';
  ctx.fillRect(hx + 2, py + 3, 2, 2);
  ctx.fillRect(hx + hs - 4, py + 3, 2, 2);
  ctx.fillStyle = t.color;
  const bh = Math.floor(t.h * 0.45);
  const by = py + hs;
  ctx.fillRect(px, by, t.w, bh);
  ctx.fillStyle = t.name === 'big' ? '#1a3a14' : t.name === 'child' ? '#885500' : '#2c3e50';
  const lh = Math.floor(t.h * 0.3);
  const ly = by + bh;
  ctx.fillRect(px + 2, ly, Math.floor(t.w / 2) - 2, lh + lf);
  ctx.fillRect(px + Math.floor(t.w / 2), ly, Math.floor(t.w / 2) - 2, lh - lf);
  ctx.fillStyle = t.color;
  ctx.fillRect(px - 3, by + 2, 4, Math.floor(bh * 0.7) + lf);
  ctx.fillRect(px + t.w - 1, by + 2, 4, Math.floor(bh * 0.7) - lf);
  if (t.name === 'woman') {
    ctx.fillStyle = '#e87ea1';
    ctx.fillRect(px + 2, by + bh - 8, t.w - 4, 10);
    ctx.fillStyle = '#6b3d0e';
    ctx.fillRect(hx - 2, py, 4, hs);
    ctx.fillRect(hx + hs - 2, py, 4, hs);
  }
  if (t.name === 'big') {
    ctx.fillStyle = '#2d5a27';
    ctx.fillRect(px - 5, by, 6, bh);
    ctx.fillRect(px + t.w - 1, by, 6, bh);
  }
  if (t.name === 'child') {
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(px + t.w - 2, by, 6, bh - 4);
  }
  if (t.name === 'ojii' || t.name === 'obaa') {
    ctx.fillStyle = '#8b6914';
    ctx.fillRect(px + t.w + 1, by, 3, bh + lh + 2);
    ctx.fillStyle = '#e8e8e8';
    ctx.fillRect(hx, py, hs, 5);
    if (t.name === 'obaa') {
      ctx.fillStyle = '#9b59b6';
      ctx.fillRect(px, by, t.w, 8);
    }
  }
  if (e.angry && Math.floor(frameCount / 20) % 2 === 0) {
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(px + Math.floor(t.w / 2) - 1, py - 10, 3, 6);
    ctx.fillRect(px + Math.floor(t.w / 2) - 1, py - 2, 3, 3);
  }
}

export function drawObstacle(ctx: CanvasRenderingContext2D, o: Obstacle): void {
  const px = Math.round(o.x);
  const py = Math.round(o.y);
  if (o.type === 'rock') {
    ctx.fillStyle = '#7f8c8d';
    ctx.fillRect(px, py + 4, o.w, o.h - 4);
    ctx.fillStyle = '#95a5a6';
    ctx.fillRect(px + 2, py, o.w - 6, o.h - 6);
    ctx.fillStyle = '#bdc3c7';
    ctx.fillRect(px + 4, py + 2, 4, 3);
  } else {
    ctx.fillStyle = '#e67e22';
    ctx.fillRect(px, py, o.w, o.h);
    ctx.fillStyle = '#d35400';
    ctx.fillRect(px, py, o.w, 4);
    ctx.fillRect(px, py, 4, o.h);
    ctx.fillStyle = '#f39c12';
    ctx.fillRect(px + 5, py + 5, o.w - 10, o.h - 10);
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(px + 2, py + 2, o.w - 4, 2);
    ctx.fillRect(px + 2, py + o.h - 4, o.w - 4, 2);
  }
}
