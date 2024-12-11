import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Security-Policy': "frame-ancestors 'self' https://telegram.org https://*.telegram.org https://telegram-web-app.github.io",
      'X-Frame-Options': 'ALLOW-FROM https://telegram.org/ https://web.telegram.org/',
    },
  },
});
