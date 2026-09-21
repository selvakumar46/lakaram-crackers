import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(async ({ command }) => {
  const plugins = [react()];

  // Only load API middleware during local dev server, NEVER during vite build
  if (command === 'serve') {
    const { default: apiApp } = await import('./apiApp.js');
    plugins.push({
      name: 'neon-api',
      configureServer(server) {
        server.middlewares.use(apiApp);
      },
      configurePreviewServer(server) {
        server.middlewares.use(apiApp);
      }
    });
  }

  return {
    plugins,
    build: {
      chunkSizeWarningLimit: 1000,
      sourcemap: false
    },
    server: {
      host: '0.0.0.0',
      port: parseInt(process.env.PORT) || 3000,
      allowedHosts: true
    },
    preview: {
      host: '0.0.0.0',
      port: parseInt(process.env.PORT) || 3000,
      allowedHosts: true
    }
  };
});

