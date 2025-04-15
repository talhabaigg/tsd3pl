import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';
import { watch } from 'vite-plugin-watch';

export default defineConfig({
  plugins: [
    watch({
      pattern: [
          'app/Enums/**/*.php',
          'app/Models/**/*.php',
          'app/Http/Requests/**/*.php',
          'routes/**/*.php'
      ],
      command: 'echo "No command to run"', // A harmless command
    }),
    laravel({
      input: 'inertia/app.tsx',
      ssr: 'inertia/ssr.tsx',
      refresh: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './inertia'),
    },
  },
});
