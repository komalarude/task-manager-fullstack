import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The proxy forwards /api requests to the backend, so the frontend can call /api/tasks directly
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
