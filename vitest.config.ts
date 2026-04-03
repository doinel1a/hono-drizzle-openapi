import path from 'node:path';

const config = {
  resolve: {
    alias: {
      '~/drizzle': path.resolve(__dirname, './drizzle'),
      '@': path.resolve(__dirname, './src')
    }
  }
};

export default config;
