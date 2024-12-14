import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer', 'process', 'util', 'stream'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@solana/web3.js': '@solana/web3.js',
      '@metaplex-foundation/js': '@metaplex-foundation/js'
    }
  },
  optimizeDeps: {
    include: ['@solana/web3.js', '@metaplex-foundation/js'],
    exclude: ['lucide-react'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  server: {
    host: true,
    headers: {
      'Cache-Control': 'no-store',
    },
  },
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  }
});
