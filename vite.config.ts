import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const envPort = (globalThis as { process?: { env?: { PORT?: string } } }).process?.env?.PORT;

export default defineConfig({
  plugins: [react()],
  preview: {
    port: Number(envPort) || 4173,
  },
});
