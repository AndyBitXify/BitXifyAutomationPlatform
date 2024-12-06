import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
    server: {
        port: 5173,        // The port the server runs on
        host: true,        // Exposes the server to your network
        open: true,        // Automatically opens the browser on server start
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
    },
});