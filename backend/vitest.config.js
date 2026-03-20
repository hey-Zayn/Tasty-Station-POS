/* eslint-disable */
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true, // Globals like describe, it, expect are available everywhere
        setupFiles: ['./__tests__/setup.db.js'], // A global hook to start the memory server
    },
});
