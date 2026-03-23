import path from 'node:path';

export default {
  resolve: {
    alias: {
      '~/drizzle': path.resolve(__dirname, './drizzle'),
      '@': path.resolve(__dirname, './src')
    }
  }
};
