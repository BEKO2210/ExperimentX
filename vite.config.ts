import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoBase = process.env.EXPERIMENTX_BASE ?? '/';

export default defineConfig({
  base: repoBase,
  plugins: [react()]
});
