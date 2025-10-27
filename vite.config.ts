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
      // FIX: As per @google/genai guidelines, the API key must be accessed via process.env.API_KEY.
      // This makes the VITE_API_KEY environment variable available as process.env.API_KEY in the client-side code.
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY)
    },
  };
});
