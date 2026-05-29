import type { ScoreEntry } from '../game/types';

const LOCAL_STORAGE_KEY = 'neko-runner-ranking-v1';

function today(): string {
  return new Date().toLocaleDateString('en-US');
}

function normalizeName(name: string): string {
  return (name.trim() || 'Anonymous Cat').slice(0, 12);
}

export function loadLocalRanking(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ScoreEntry[]) : [];
  } catch {
    return [];
  }
}

function saveLocalRanking(list: ScoreEntry[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // localStorage can be unavailable in private modes.
  }
}

function addLocalScore(name: string, score: number): ScoreEntry[] {
  const list = loadLocalRanking();
  list.push({ name: normalizeName(name), score, date: today() });
  const top = list.sort((a, b) => b.score - a.score).slice(0, 10);
  saveLocalRanking(top);
  return top;
}

export function loadRanking(): ScoreEntry[] {
  return loadLocalRanking();
}

export function submitRanking(name: string, score: number): ScoreEntry[] {
  return addLocalScore(name, score);
}
