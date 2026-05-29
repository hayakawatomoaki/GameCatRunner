import './styles/global.css';
import { Game } from './game/Game';
import { bindInput } from './game/input';
import { createAppShell, byId } from './ui/dom';
import { closeRanking, showRanking, submitScore } from './ui/ranking';
import { registerServiceWorker } from './pwa';

createAppShell();

const game = new Game(byId<HTMLCanvasElement>('gameCanvas'));
bindInput(game);
registerServiceWorker();

byId<HTMLButtonElement>('start-btn').addEventListener('click', () => game.start());
byId<HTMLButtonElement>('ranking-btn-title').addEventListener('click', showRanking);
byId<HTMLButtonElement>('ranking-overlay-btn').addEventListener('click', showRanking);
byId<HTMLButtonElement>('ranking-close-btn').addEventListener('click', closeRanking);
byId<HTMLButtonElement>('restart-btn').addEventListener('click', () => game.restart());
byId<HTMLButtonElement>('tap-prompt').addEventListener('click', () => game.goStage2());
byId<HTMLButtonElement>('submit-score-btn').addEventListener('click', () => submitScore(game.currentScore));
byId<HTMLInputElement>('player-name-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    submitScore(game.currentScore);
  }
});
