export function createAppShell(): HTMLElement {
  const app = document.getElementById('app');
  if (!app) throw new Error('Missing #app');
  app.innerHTML = `
    <div id="title-screen">
      <div class="title-cat">🐱</div>
      <h1>NEKO RUNNER</h1>
      <div class="subtitle">
        The cat must keep running from humans!<br />
        SPACE / TAP to jump
      </div>
      <button class="start-btn" id="start-btn">▶ START</button>
      <button id="ranking-btn-title">🏆 RANKING</button>
      <div class="controls-note">PC: SPACE / ↑ KEY &nbsp;|&nbsp; Mobile: TAP</div>
    </div>

    <div id="game-container">
      <div id="hud">
        <span id="score-display">SCORE: 0</span>
        <span id="hi-display">HI: 0</span>
        <span id="speed-display">SPEED: 1</span>
      </div>
      <div id="canvas-wrapper">
        <canvas id="gameCanvas"></canvas>
        <div id="overlay">
          <div id="overlay-stage1">
            <h2>GAME OVER</h2>
            <div id="result-text"></div>
            <button id="tap-prompt">▶ TAP / CLICK TO CONTINUE</button>
          </div>
          <div id="overlay-stage2">
            <div id="stage2-score"></div>
            <div id="name-input-area">
              <label>🏆 REGISTER YOUR NAME TO THE LEADERBOARD<br />(max 12 characters)</label>
              <input type="text" id="player-name-input" maxlength="12" placeholder="YOUR NAME" autocomplete="off" spellcheck="false" />
              <button id="submit-score-btn">✔ SUBMIT</button>
            </div>
            <button class="overlay-btn" id="restart-btn">▶ PLAY AGAIN</button>
            <button class="overlay-btn secondary" id="ranking-overlay-btn">🏆 VIEW RANKING</button>
          </div>
        </div>
      </div>
      <div id="instructions">SPACE / ↑ / TAP : Jump &nbsp;|&nbsp; Double Jump available!</div>
    </div>

    <div id="ranking-screen">
      <h2>🏆 RANKING 🏆</h2>
      <div class="ranking-subtitle">NEKO RUNNER - ALL-TIME HIGH SCORES TOP 10</div>
      <div id="ranking-list"><div class="loading-text">Loading...</div></div>
      <button class="ranking-close-btn" id="ranking-close-btn">✕ CLOSE</button>
    </div>
  `;
  return app;
}

export function byId<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing #${id}`);
  return el as T;
}
