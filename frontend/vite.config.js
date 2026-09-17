import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendTarget = env.VITE_BACKEND_URL || env.BACKEND_URL || 'http://localhost:8080'

  const proxyConfig = {
    target: backendTarget,
    changeOrigin: true,
    secure: false,
    configure: (proxy, options) => {
      proxy.on('error', (err, req, res) => {
        // Gracefully handle backend offline without throwing unhandled AggregateError ECONNREFUSED
        if (res && !res.headersSent) {
          res.writeHead(503, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ 
            status: 'DOWN', 
            message: 'Backend service offline or unreachable. Using client-side storage.' 
          }))
        }
      })
    }
  }

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: parseInt(process.env.PORT) || 3000,
      allowedHosts: true,
      proxy: {
        '/api': proxyConfig
      }
    },
    preview: {
      host: '0.0.0.0',
      port: parseInt(process.env.PORT) || 3000,
      allowedHosts: true,
      proxy: {
        '/api': proxyConfig
      }
    }
  }
})
