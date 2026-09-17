import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiApp from './apiApp.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT) || 3000;

// 1. Mount API router (Neon Serverless PostgreSQL)
app.use(apiApp);

// 2. Serve static frontend assets built in dist/
app.use(express.static(path.join(__dirname, 'dist')));

// 3. Fallback for React Router / Single Page App
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 4. Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🎆 Lakaram Crackers Full-Stack Production Server`);
  console.log(`🚀 Serving frontend and Neon PostgreSQL API on 0.0.0.0:${PORT}`);
  console.log(`🌐 Neon Database Connected`);
  console.log(`====================================================`);
});
