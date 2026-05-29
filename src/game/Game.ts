import { SoundPlayer } from '../audio/sound';
import { checkCollision } from './collision';
import { ENEMY_TYPES, GROUND_Y, H, SPEED_LINE_Y, STAR_POSITIONS, W } from './constants';
import { getResultMessage } from './messages';
import type { Cat, Cloud, Enemy, GameStateName, Obstacle, Particle } from './types';
import { drawCat, drawEnemy, drawObstacle } from '../render/drawSprites';
import { byId } from '../ui/dom';

export class Game {
  readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly sound = new SoundPlayer();
  private readonly titleScreen = byId<HTMLDivElement>('title-screen');
  private readonly gameContainer = byId<HTMLDivElement>('game-container');
  private readonly canvasWrapper = byId<HTMLDivElement>('canvas-wrapper');
  private readonly overlay = byId<HTMLDivElement>('overlay');
  private readonly overlayStage1 = byId<HTMLDivElement>('overlay-stage1');
  private readonly overlayStage2 = byId<HTMLDivElement>('overlay-stage2');
  private readonly resultText = byId<HTMLDivElement>('result-text');
  private readonly tapPrompt = byId<HTMLButtonElement>('tap-prompt');
  private readonly stage2Score = byId<HTMLDivElement>('stage2-score');
  private readonly playerNameInput = byId<HTMLInputElement>('player-name-input');
  private readonly submitScoreButton = byId<HTMLButtonElement>('submit-score-btn');
  private readonly nameInputArea = byId<HTMLDivElement>('name-input-area');
  private readonly scoreDisplay = byId<HTMLSpanElement>('score-display');
  private readonly hiDisplay = byId<HTMLSpanElement>('hi-display');
  private readonly speedDisplay = byId<HTMLSpanElement>('speed-display');
  private readonly isTouchDevice = matchMedia('(pointer: coarse)').matches;
  private hiScore = 0;
  private gameState: GameStateName = 'idle';
  private score = 0;
  private frameCount = 0;
  private speed = 4;
  private obstacles: Obstacle[] = [];
  private enemies: Enemy[] = [];
  private particles: Particle[] = [];
  private spawnTimer = 0;
  private nextSpawn = 60;
  private clouds: Cloud[] = [];
  private speedUpFlash = 0;
  private lastSpeedLevel = 0;
  private restartReady = false;
  private wasOnGround = true;
  private lastTime = 0;
  private loopStarted = false;
  private onStage2Score?: (score: number, hiScore: number) => void;

  private readonly cat: Cat = {
    x: 80,
    y: GROUND_Y,
    w: 36,
    h: 36,
    vy: 0,
    jumpCount: 0,
    maxJumps: 2,
    frame: 0,
    frameTimer: 0,
    dead: false,
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context is unavailable');
    this.ctx = ctx;
    this.canvas.width = W;
    this.canvas.height = H;
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    window.addEventListener('orientationchange', () => window.setTimeout(() => this.resizeCanvas(), 250));
    window.visualViewport?.addEventListener('resize', () => this.resizeCanvas());
  }

  get state(): GameStateName {
    return this.gameState;
  }

  get currentScore(): number {
    return this.score;
  }

  setStage2ScoreHandler(handler: (score: number, hiScore: number) => void): void {
    this.onStage2Score = handler;
  }

  start(): void {
    this.sound.warmup();
    this.titleScreen.style.display = 'none';
    this.gameContainer.style.display = 'flex';
    this.restart();
    if (!this.loopStarted) {
      this.loopStarted = true;
      requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
  }

  restart(): void {
    this.gameState = 'playing';
    this.score = 0;
    this.frameCount = 0;
    this.speed = 4;
    this.obstacles = [];
    this.enemies = [];
    this.particles = [];
    this.spawnTimer = 0;
    this.nextSpawn = 60;
    this.restartReady = false;
    this.wasOnGround = true;
    this.speedUpFlash = 0;
    this.lastSpeedLevel = 0;
    this.initClouds();
    this.resetCat();
    this.overlay.style.display = 'none';
    this.updateHud(true);
  }

  jump(): void {
    if (this.gameState === 'idle') {
      this.start();
      return;
    }
    if (this.gameState === 'dead') {
      if (document.activeElement === this.playerNameInput) return;
      if (this.overlayStage1.style.display !== 'none') {
        if (this.restartReady) this.goStage2();
      }
      return;
    }
    if (this.cat.jumpCount < this.cat.maxJumps) {
      const isDouble = this.cat.jumpCount === 1;
      this.cat.vy = -10;
      this.cat.jumpCount++;
      this.spawnParticles(this.cat.x + 10, this.cat.y + this.cat.h, '#ffaa33', 5);
      this.sound.play(isDouble ? 'doubleJump' : 'jump');
    }
  }

  goStage2(): void {
    this.overlayStage1.style.display = 'none';
    this.overlayStage2.style.display = 'flex';
    this.stage2Score.innerHTML = `SCORE: ${this.score}&nbsp;&nbsp;|&nbsp;&nbsp;BEST: ${this.hiScore}`;
    this.playerNameInput.value = '';
    this.submitScoreButton.textContent = '✔ SUBMIT';
    this.submitScoreButton.disabled = false;
    this.nameInputArea.style.display = '';
    this.onStage2Score?.(this.score, this.hiScore);
  }

  private resizeCanvas(): void {
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const verticalUiBudget = viewportHeight < 500 ? 54 : 78;
    const maxByHeight = Math.max(280, (viewportHeight - verticalUiBudget) * (W / H));
    const maxWidth = Math.min(viewportWidth - 20, maxByHeight, 800);
    this.canvasWrapper.style.maxWidth = `${maxWidth}px`;
    this.canvasWrapper.style.aspectRatio = `${W} / ${H}`;
  }

  private resetCat(): void {
    this.cat.y = GROUND_Y - this.cat.h;
    this.cat.vy = 0;
    this.cat.jumpCount = 0;
    this.cat.frame = 0;
    this.cat.frameTimer = 0;
    this.cat.dead = false;
  }

  private initClouds(): void {
    this.clouds = [];
    for (let i = 0; i < 5; i++) {
      this.clouds.push({
        x: Math.random() * W,
        y: 10 + Math.random() * 40,
        w: 40 + Math.random() * 40,
        speed: 0.3 + Math.random() * 0.3,
      });
    }
  }

  private spawnParticles(x: number, y: number, color: string, count: number): void {
    const particleCount = this.isTouchDevice ? Math.ceil(count * 0.6) : count;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: -Math.random() * 5 - 1,
        life: 1,
        color,
        size: Math.random() * 4 + 2,
      });
    }
  }

  private spawnEntity(): void {
    if (Math.random() < 0.25) {
      const type = Math.random() < 0.5 ? 'rock' : 'box';
      const h = type === 'rock' ? 22 + Math.floor(Math.random() * 14) : 24;
      const w = type === 'rock' ? 24 + Math.floor(Math.random() * 10) : 22;
      this.obstacles.push({ x: W + 10, y: GROUND_Y - h, w, h, type });
    } else {
      const type = ENEMY_TYPES[Math.floor(Math.random() * ENEMY_TYPES.length)];
      this.enemies.push({
        x: W + 10,
        y: GROUND_Y - type.h,
        type,
        frame: 0,
        frameTimer: 0,
        angry: Math.random() < 0.4,
      });
    }
    this.nextSpawn = Math.max(30, 90 - Math.floor(this.score / 200) * 5 + Math.floor(Math.random() * 40 - 20));
  }

  private die(): void {
    this.gameState = 'dead';
    this.restartReady = false;
    this.cat.dead = true;
    this.spawnParticles(this.cat.x + this.cat.w / 2, this.cat.y + this.cat.h / 2, '#ff4444', 15);
    this.spawnParticles(this.cat.x + this.cat.w / 2, this.cat.y + this.cat.h / 2, '#ffaa33', 10);
    this.sound.play('die');

    const m = getResultMessage(this.score);
    this.resultText.innerHTML =
      `<span class="message-jp">${m.jp.replace(/\n/g, '<br />')}</span>` +
      `<br /><span class="message-en">${m.en.replace(/\n/g, '<br />')}</span>`;

    this.overlayStage1.style.display = 'flex';
    this.overlayStage2.style.display = 'none';
    this.tapPrompt.classList.remove('visible');
    this.overlay.style.display = 'flex';

    window.setTimeout(() => {
      this.restartReady = true;
      this.tapPrompt.classList.add('visible');
    }, 1500);
  }

  private update(): void {
    if (this.gameState !== 'playing') return;
    this.frameCount++;
    this.score += 1;
    const speedLevel = Math.floor(this.score / 300);
    this.speed = Math.min(14, 4 + speedLevel * 0.5);
    if (speedLevel > this.lastSpeedLevel && this.score > 10) {
      this.speedUpFlash = 50;
      this.lastSpeedLevel = speedLevel;
      this.sound.play('speedUp');
    }

    this.cat.vy += 0.55;
    this.cat.y += this.cat.vy;
    const onGround = this.cat.y >= GROUND_Y - this.cat.h;
    if (onGround) {
      if (!this.wasOnGround) this.sound.play('land');
      this.cat.y = GROUND_Y - this.cat.h;
      this.cat.vy = 0;
      this.cat.jumpCount = 0;
    }
    this.wasOnGround = onGround;
    this.cat.frameTimer++;
    if (this.cat.frameTimer > 5) {
      this.cat.frame++;
      this.cat.frameTimer = 0;
    }

    for (const c of this.clouds) {
      c.x -= c.speed * (this.speed / 4);
      if (c.x + c.w < 0) {
        c.x = W + 20;
        c.y = 10 + Math.random() * 40;
      }
    }

    this.spawnTimer++;
    if (this.spawnTimer >= this.nextSpawn) {
      this.spawnTimer = 0;
      this.spawnEntity();
    }

    this.obstacles = this.obstacles.filter((o) => o.x + o.w > -10);
    for (const o of this.obstacles) {
      o.x -= this.speed;
      if (checkCollision(this.cat, this.cat.w, this.cat.h, o, o.w, o.h)) {
        this.die();
        return;
      }
    }

    this.enemies = this.enemies.filter((e) => e.x + e.type.w > -20);
    for (const e of this.enemies) {
      e.x -= this.speed * e.type.speed;
      e.frameTimer++;
      if (e.frameTimer > 7) {
        e.frame++;
        e.frameTimer = 0;
      }
      if (checkCollision(this.cat, this.cat.w, this.cat.h, e, e.type.w, e.type.h)) {
        this.die();
        return;
      }
    }

    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2;
      p.life -= 0.04;
    }
    this.particles = this.particles.filter((p) => p.life > 0);

    if (this.score > this.hiScore) {
      this.hiScore = this.score;
    }
    if (this.frameCount % 4 === 0) this.updateHud(false);
  }

  private updateHud(force: boolean): void {
    if (!force && this.frameCount % 4 !== 0) return;
    this.scoreDisplay.textContent = `SCORE: ${this.score}`;
    this.speedDisplay.textContent = `SPEED: ${this.speed.toFixed(1)}`;
    this.hiDisplay.textContent = `HI: ${this.hiScore}`;
  }

  private draw(): void {
    this.ctx.clearRect(0, 0, W, H);
    this.ctx.fillStyle = '#0d1b2a';
    this.ctx.fillRect(0, 0, W, H * 0.6);
    this.ctx.fillStyle = '#1a2d4a';
    this.ctx.fillRect(0, H * 0.6, W, H * 0.4);
    this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
    for (const s of STAR_POSITIONS) {
      const sx = (s.bx + this.frameCount * 0.1) % W;
      this.ctx.fillRect(sx, s.by, s.size, s.size);
    }
    this.ctx.fillStyle = 'rgba(255,255,255,0.12)';
    for (const c of this.clouds) {
      this.ctx.beginPath();
      this.ctx.ellipse(c.x + c.w / 2, c.y + 10, c.w / 2, 12, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.ellipse(c.x + c.w * 0.3, c.y + 14, c.w * 0.3, 9, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.ellipse(c.x + c.w * 0.7, c.y + 14, c.w * 0.3, 8, 0, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.fillStyle = '#2c3e50';
    this.ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
    this.ctx.fillStyle = '#3d5166';
    this.ctx.fillRect(0, GROUND_Y, W, 3);
    this.ctx.fillStyle = '#4a6177';
    for (let i = 0; i < W; i += 20) {
      this.ctx.fillRect((i + Math.floor(this.frameCount * this.speed * 0.5)) % W, GROUND_Y + 6, 2, 2);
    }
    for (const p of this.particles) {
      this.ctx.globalAlpha = p.life;
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    this.ctx.globalAlpha = 1;
    for (const o of this.obstacles) drawObstacle(this.ctx, o);
    for (const e of this.enemies) drawEnemy(this.ctx, e, this.frameCount);
    drawCat(this.ctx, this.cat.x, this.cat.y, this.cat.frame, this.cat.dead);
    if (this.speed > 8) {
      const alpha = Math.min((this.speed - 8) * 0.03, 0.15);
      this.ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
      this.ctx.lineWidth = 1;
      for (let i = 0; i < SPEED_LINE_Y.length; i++) {
        const lx = (i * 200 + Math.floor(this.frameCount * this.speed * 2)) % W;
        this.ctx.beginPath();
        this.ctx.moveTo(lx, SPEED_LINE_Y[i]);
        this.ctx.lineTo(lx - 30, SPEED_LINE_Y[i]);
        this.ctx.stroke();
      }
    }
    if (this.speedUpFlash > 0) {
      const alpha = Math.min(this.speedUpFlash / 50, 1) * 0.2;
      this.ctx.fillStyle = `rgba(255,215,0,${alpha})`;
      this.ctx.fillRect(0, 0, W, H);
      this.ctx.fillStyle = '#ffd700';
      this.ctx.font = '12px "Press Start 2P", monospace';
      this.ctx.fillText('SPEED UP!', W / 2 - 55, H / 2);
      this.speedUpFlash--;
    }
  }

  private gameLoop(timestamp: number): void {
    const delta = timestamp - this.lastTime;
    if (delta > 14) {
      this.lastTime = timestamp;
      this.update();
      this.draw();
    }
    requestAnimationFrame((nextTimestamp) => this.gameLoop(nextTimestamp));
  }
}
