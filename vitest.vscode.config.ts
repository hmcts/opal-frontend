import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from './vitest.config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      disableConsoleIntercept: true,
      include: ['src/**/*.spec.ts'],
      setupFiles: ['src/test-setup.vscode.ts'],
    },
  }),
);
