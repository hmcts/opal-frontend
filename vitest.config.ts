import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@app': resolve(__dirname, 'src/app'),
      '@constants': resolve(__dirname, 'src/app/constants'),
      '@services/fines': resolve(__dirname, 'src/app/flows/fines/services'),
      '@routing/pages': resolve(__dirname, 'src/app/pages/routing'),
      '@routing/fines': resolve(__dirname, 'src/app/flows/fines/routing'),
      '@routing/flows': resolve(__dirname, 'src/app/flows/routing'),
      '@ministryofjustice/frontend/moj/all': resolve(__dirname, 'node_modules/@ministryofjustice/frontend/moj/all.mjs'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    exclude: [
      'cypress/**',
      '**/*.cy.ts',
      'src/**/*.component.html',
      'src/**/*.mock.ts',
      'src/**/*.interface.ts',
      'src/**/*.type.ts',
      'src/**/*.constant.ts',
      'src/**/*.routes.ts',
      'src/**/*.routing.ts',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json'],
      reportsDirectory: 'coverage',
      exclude: [
        'cypress/**',
        '**/*.cy.ts',
        'src/**/*.component.html',
        'src/**/*.mock.ts',
        'src/**/*.interface.ts',
        'src/**/*.type.ts',
        'src/**/*.constant.ts',
        'src/**/*.routes.ts',
        'src/**/*.routing.ts',
      ],
    },
  },
});
