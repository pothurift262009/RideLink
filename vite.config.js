import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  preview: {
    port: 5173,
    host: true, // This makes the server accessible externally
    allowedHosts: ['ridelink-1.onrender.com', 'ridelink-3nk4.onrender.com', 'ridelink-1zwv.onrender.com'],
  },
});
