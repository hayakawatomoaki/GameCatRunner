import type { Game } from './Game';
import { byId } from '../ui/dom';

export function bindInput(game: Game): void {
  document.addEventListener('keydown', (e) => {
    if (e.code !== 'Space' && e.code !== 'ArrowUp') return;
    if (document.activeElement === byId<HTMLInputElement>('player-name-input')) return;
    e.preventDefault();
    game.jump();
  });

  document.addEventListener(
    'touchstart',
    (e) => {
      if (document.activeElement === byId<HTMLInputElement>('player-name-input')) return;
      if ((e.target as Element).closest('button, input, a')) return;
      if (game.state === 'dead' && byId<HTMLDivElement>('overlay-stage2').style.display === 'flex') return;
      e.preventDefault();
      game.jump();
    },
    { passive: false },
  );

  document.addEventListener(
    'touchend',
    (e) => {
      if (e.target === game.canvas) e.preventDefault();
    },
    { passive: false },
  );

  document.addEventListener(
    'touchmove',
    (e) => {
      if (e.target === game.canvas) e.preventDefault();
    },
    { passive: false },
  );
}
