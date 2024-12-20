import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        fs: {
            // Allow serving files from one level up to the project root.
            strict: false,
        },
    },
});
