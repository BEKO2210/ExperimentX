# GitHub Pages Deployment (Run 012)

## Goal
Build ExperimentX for static hosting on GitHub Pages without backend dependencies.

## Local Pages-like build
```bash
npm install
npm run build:pages
```

This uses `EXPERIMENTX_BASE=/ExperimentX/` so asset paths match the repository site URL:
`https://<user>.github.io/ExperimentX/`.

## Preview Pages build locally
```bash
npm run preview:pages
```

## GitHub setup
1. Push repository to GitHub.
2. In **Settings → Pages**, select **GitHub Actions** as source.
3. Add workflow file below (already included in this run) or create one manually.

## Notes
- No API keys are required.
- Session data remains local to browser storage unless user exports JSON.
- Use conservative claim language in all published pages.


## White page troubleshooting
If GitHub Pages shows a blank/white screen:
1. Ensure deployment happened from `main` and workflow `Deploy Pages` succeeded.
2. Verify built `index.html` references `/<repo>/assets/...` (for this repo: `/ExperimentX/assets/...`).
3. Hard-refresh the browser and clear site data/localStorage if needed.
4. Confirm latest commit includes the Pages base fix in `vite.config.ts` and redeploy.


If a runtime exception still occurs, the app now shows a **Recovery Mode** screen instead of a blank page, including a button to clear local data and reload.
