import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.test.js'],
    include: [
      'tests/**/*.test.js',
      'tests/controllers/**/*.test.js'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/']
    },
    // Add this section to handle module imports
    deps: {
      inline: ['dotenv']
    }
  }
});
