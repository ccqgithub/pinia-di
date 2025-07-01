import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  define: {
    __DEV__: true,
    __TEST__: true,
    __BROWSER__: true,
    __USE_DEVTOOLS__: false
  },
  plugins: [vue()],
  test: {
    include: ['src/**/*.{test,spec}.ts', 'tests/**/*.{test,spec}.ts'],
    environment: 'happy-dom',
    typecheck: {
      enabled: true
    },
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'lcovonly', 'html'],
      all: true,
      include: ['src/**/*'],
      exclude: ['tests/**/*']
    }
  }
});
