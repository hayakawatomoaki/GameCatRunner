export type Rect = {
  x: number;
  y: number;
};

export function checkCollision(a: Rect, aw: number, ah: number, b: Rect, bw: number, bh: number): boolean {
  const margin = 4;
  return (
    a.x + margin < b.x + bw - margin &&
    a.x + aw - margin > b.x + margin &&
    a.y + margin < b.y + bh - margin &&
    a.y + ah - margin > b.y + margin
  );
}
