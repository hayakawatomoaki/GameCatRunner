export type GameStateName = 'idle' | 'playing' | 'dead';

export type EnemyType = {
  name: 'man' | 'woman' | 'big' | 'child' | 'ojii' | 'obaa';
  color: string;
  headColor: string;
  w: number;
  h: number;
  speed: number;
};

export type Cat = {
  x: number;
  y: number;
  w: number;
  h: number;
  vy: number;
  jumpCount: number;
  maxJumps: number;
  frame: number;
  frameTimer: number;
  dead: boolean;
};

export type Enemy = {
  x: number;
  y: number;
  type: EnemyType;
  frame: number;
  frameTimer: number;
  angry: boolean;
};

export type Obstacle = {
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'rock' | 'box';
};

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
};

export type Cloud = {
  x: number;
  y: number;
  w: number;
  speed: number;
};

export type ScoreEntry = {
  name: string;
  score: number;
  date: string;
};
