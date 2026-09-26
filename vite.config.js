import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_TMDB_API': JSON.stringify(env.TMDB_API || env.VITE_TMDB_API || ''),
      'process.env.TMDB_API': JSON.stringify(env.TMDB_API || env.VITE_TMDB_API || ''),
    },
    server: {
      port: 5173,
      host: true,
    }
  };
});
