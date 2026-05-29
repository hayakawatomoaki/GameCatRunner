import type { EnemyType } from './types';

export const W = 800;
export const H = 200;
export const GROUND_Y = H - 30;

export const ENEMY_TYPES: EnemyType[] = [
  { name: 'man', color: '#4a90d9', headColor: '#f4c8a0', w: 20, h: 38, speed: 1 },
  { name: 'woman', color: '#e87ea1', headColor: '#f4c8a0', w: 18, h: 40, speed: 0.9 },
  { name: 'big', color: '#2d5a27', headColor: '#c8a070', w: 28, h: 50, speed: 1.1 },
  { name: 'child', color: '#ffb347', headColor: '#f4c8a0', w: 14, h: 28, speed: 1.3 },
  { name: 'ojii', color: '#888888', headColor: '#e0c8b0', w: 18, h: 34, speed: 0.7 },
  { name: 'obaa', color: '#9b59b6', headColor: '#e0c8b0', w: 18, h: 34, speed: 0.7 },
];

export const STAR_POSITIONS = Array.from({ length: 40 }, (_, i) => ({
  bx: (i * 137) % W,
  by: (i * 73) % 120,
  size: i % 3 === 0 ? 2 : 1,
}));

export const SPEED_LINE_Y = Array.from({ length: 6 }, (_, i) => 15 + i * 25);
