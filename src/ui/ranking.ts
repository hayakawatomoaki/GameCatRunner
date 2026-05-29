import type { ScoreEntry } from '../game/types';
import { byId } from './dom';
import { loadRanking, submitRanking } from '../storage/rankingStorage';

let lastSubmittedName = '';
let lastSubmittedScore: number | null = null;

function escHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderRankingList(list: ScoreEntry[], showNew: boolean): void {
  const el = byId<HTMLDivElement>('ranking-list');
  if (!list.length) {
    el.innerHTML = '<div class="rank-empty">No records yet.<br /><br />Be the first legend!</div>';
    return;
  }

  const medals = ['🥇', '🥈', '🥉'];
  el.innerHTML = list
    .map((entry, i) => {
      const rankClass = i < 3 ? ` rank-${i + 1}` : '';
      const isNew = showNew && entry.name === lastSubmittedName && entry.score === lastSubmittedScore;
      const numEl =
        i < 3
          ? `<span class="rank-num">${medals[i]}</span>`
          : `<span class="rank-num">${i + 1}</span>`;
      const badge = isNew
        ? '<span class="rank-new">★NEW</span>'
        : `<span class="rank-date">${escHtml(entry.date || '')}</span>`;
      return `<div class="rank-row${rankClass}${isNew ? ' highlight' : ''}">
        ${numEl}
        <span class="rank-name">${escHtml(entry.name)}</span>
        <span class="rank-score">${entry.score}</span>
        ${badge}
      </div>`;
    })
    .join('');
}

export function showRanking(): void {
  byId<HTMLDivElement>('ranking-screen').style.display = 'flex';
  byId<HTMLDivElement>('ranking-list').innerHTML = '<div class="loading-text">Loading...</div>';
  const list = loadRanking();
  renderRankingList(list, false);
}

export function closeRanking(): void {
  byId<HTMLDivElement>('ranking-screen').style.display = 'none';
}

export function submitScore(score: number): void {
  const input = byId<HTMLInputElement>('player-name-input');
  const name = input.value.trim() || 'Anonymous Cat';
  lastSubmittedName = name.slice(0, 12);
  lastSubmittedScore = score;
  byId<HTMLDivElement>('name-input-area').style.display = 'none';
  byId<HTMLDivElement>('ranking-screen').style.display = 'flex';
  byId<HTMLDivElement>('ranking-list').innerHTML = '<div class="loading-text">Saving...</div>';
  const list = submitRanking(name, score);
  renderRankingList(list, true);
}
