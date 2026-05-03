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
