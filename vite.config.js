import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0',  // ✅ Bra
        port: 5173,        // ✅ Bra
        watch: {
            usePolling: true,  // ✅ VIKTIGT för Docker (särskilt Windows)
            interval: 100      // ✅ Intervall i ms
        },
        hmr: {
            host: 'localhost',  // ✅ För browser att koppla till
            port: 5173,
            protocol: 'ws'      // ✅ WebSocket protokoll
        },
        proxy: {
            '/api': {
                target: 'http://journalsystem:8080',
                changeOrigin: true,
            }
        }
    }
})
