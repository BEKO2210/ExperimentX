import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function resolveBase(): string {
  if (process.env.EXPERIMENTX_BASE) return process.env.EXPERIMENTX_BASE;
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
  if (process.env.GITHUB_ACTIONS === 'true' && repo) {
    return `/${repo}/`;
  }
  return '/';
}

export default defineConfig({
  base: resolveBase(),
  plugins: [react()]
});
