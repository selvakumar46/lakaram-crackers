import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import apiApp from './apiApp.js';

// https://vitejs.dev/config/
export default defineConfig(() => {
  const neonApiPlugin = {
    name: 'neon-api',
    configureServer(server) {
      server.middlewares.use(apiApp);
    },
    configurePreviewServer(server) {
      server.middlewares.use(apiApp);
    }
  };

  return {
    plugins: [react(), neonApiPlugin],
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
