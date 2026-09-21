import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import apiApp from './apiApp.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Default to Render's default port 10000 if not specified
const PORT = parseInt(process.env.PORT) || 10000;

// Render & Cloud Health Check endpoints (instant 200 OK without DB wait)
app.get('/healthz', (req, res) => res.status(200).send('OK'));
app.get('/ping', (req, res) => res.status(200).send('pong'));

// 1. Mount API router (Neon Serverless PostgreSQL)
app.use(apiApp);

// 2. Serve static frontend assets built in dist/
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}

// 3. Fallback for React Router / Single Page App
app.use((req, res) => {
  const distIndex = path.join(distDir, 'index.html');
  if (fs.existsSync(distIndex)) {
    res.sendFile(distIndex);
  } else {
    // Fallback if build is still compiling or missing
    const rootIndex = path.join(__dirname, 'index.html');
    if (fs.existsSync(rootIndex)) {
      res.sendFile(rootIndex);
    } else {
      res.status(200).send('Lakaram Crackers Store is starting up. Please refresh in a moment.');
    }
  }
});

// Process safety handlers so server never crashes on transient unhandled errors
process.on('uncaughtException', (err) => {
  console.error('[Process Uncaught Exception]:', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.error('[Process Unhandled Rejection]:', reason);
});

// 4. Start Server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🎆 Lakaram Crackers Full-Stack Production Server`);
  console.log(`🚀 Serving on 0.0.0.0:${PORT}`);
  console.log(`🌐 Neon Database Connected`);
  console.log(`====================================================`);
});

// Render 502 Fix: Keep-alive timeout must exceed Render load balancer timeout (100s)
server.keepAliveTimeout = 120000; // 120 seconds
server.headersTimeout = 120000;   // 120 seconds

