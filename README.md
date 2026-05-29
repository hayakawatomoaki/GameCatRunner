# NEKO RUNNER

Canvas-based pixel runner game built with Vite + Vanilla TypeScript.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production files are generated in `dist/`.

## GitHub Pages

This project includes `.github/workflows/deploy.yml`.

1. Create a GitHub repository.
2. Push this project to the `main` branch.
3. In GitHub, open Settings > Pages.
4. Set the source to GitHub Actions.
5. Push to `main` to deploy.

## Ranking

Scores are currently saved with `localStorage`, so rankings are stored per device/browser.

The shared online leaderboard is intentionally deferred. Do not put API keys or database keys in public frontend source code.

## PWA

The app includes:

- `public/manifest.webmanifest`
- `public/service-worker.js`
- SVG app icons
- cached sound assets

On mobile browsers, use the browser menu to add the game to the home screen.
