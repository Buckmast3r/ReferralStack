import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    root: '.', // Ensure the root is set to the project directory
    base: '/', // Set the base path for resolving assets
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'), // Alias '@' to the 'src' directory
        },
    },
    build: {
        rollupOptions: {
            input: './index.html', // Explicitly specify the entry point
        },
    },
    server: {
        fs: {
            strict: true, // Enable strict file system access
        },
    },
});
