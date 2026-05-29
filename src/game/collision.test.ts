import { describe, expect, it } from 'vitest';
import { checkCollision } from './collision';

describe('checkCollision', () => {
  it('detects overlapping rectangles after the hitbox margin is applied', () => {
    expect(checkCollision({ x: 10, y: 10 }, 30, 30, { x: 25, y: 20 }, 20, 20)).toBe(true);
  });

  it('ignores rectangles that only touch near their padded edges', () => {
    expect(checkCollision({ x: 10, y: 10 }, 30, 30, { x: 38, y: 10 }, 20, 20)).toBe(false);
  });
});
