// Fix: Add a triple-slash directive to include Node.js type definitions, resolving the type error on 'process.cwd()'.
/// <reference types="node" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // This makes process.env.API_KEY available in the client-side code,
      // pulling the value from Vercel's build environment variables.
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
});
