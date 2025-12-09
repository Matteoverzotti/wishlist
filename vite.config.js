import {defineConfig} from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from "node:path";

export default defineConfig({
    resolve: {
        alias: {
            'ziggy-js': path.resolve('vendor/tightenco/ziggy/dist/vue.es.js'),
        }
    },
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
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
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
