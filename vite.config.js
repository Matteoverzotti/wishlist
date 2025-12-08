import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 5173,
        hmr: {
            host: 'localhost',
            port: 5173,
            clientPort: 5173,
        },
        watch: {
            usePolling: true,
            interval: 300,
            ignored: ['**/node_modules/**', '**/vendor/**'],
        }
    },
    plugins: [
        laravel({
            input: ['frontend/css/app.css', 'frontend/js/app.tsx'],
            refresh: true,
            detectTls: false,
        }),
        tailwindcss(),
        react({
            fastRefresh: true,
            include: "**/*.tsx",
        }),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: undefined,
            },
        },
    },
    optimizeDeps: {
        include: ['react', 'react-dom'],
    },
});
