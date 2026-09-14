import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const safeEnv = {
    NODE_ENV: mode === 'production' ? 'production' : 'development',
    REACT_APP_API_URL: env.REACT_APP_API_URL || 'http://localhost:5000/api',
    REACT_APP_USE_MOCK: env.REACT_APP_USE_MOCK || 'false',
    REACT_APP_GOOGLE_CLIENT_ID: env.REACT_APP_GOOGLE_CLIENT_ID || '',
  };

  return {
    plugins: [
      react({
        include: /\.(jsx|js|tsx|ts)$/,
      }),
    ],
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    server: {
      port: parseInt(env.PORT, 10) || 3005,
      open: false,
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(safeEnv.NODE_ENV),
      'process.env.REACT_APP_API_URL': JSON.stringify(safeEnv.REACT_APP_API_URL),
      'process.env.REACT_APP_USE_MOCK': JSON.stringify(safeEnv.REACT_APP_USE_MOCK),
      'process.env.REACT_APP_GOOGLE_CLIENT_ID': JSON.stringify(safeEnv.REACT_APP_GOOGLE_CLIENT_ID),
      'process.env': JSON.stringify(safeEnv),
    },
    build: {
      outDir: 'dist',
    },
  };
});
