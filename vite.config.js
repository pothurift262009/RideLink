import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // This makes the environment variable available to the client-side code
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    server: {
      port: 5173,
    },
    preview: {
      port: 5173,
      host: true, // This makes the server accessible externally
      allowedHosts: ['ridelink-1.onrender.com', 'ridelink-3nk4.onrender.com', 'ridelink-1zwv.onrender.com'],
    },
  };
});
