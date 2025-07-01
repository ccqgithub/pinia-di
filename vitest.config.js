import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';

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
    setupFiles: [
      fileURLToPath(new URL('./tests/vitest-setup.ts', import.meta.url))
    ],
    environment: 'happy-dom',
    typecheck: {
      enabled: true
    },
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'lcovonly', 'html'],
      all: true,
      include: ['src/**/*', 'tests/**/*.vue'],
      exclude: ['tests/**/*.ts']
    }
  }
});
