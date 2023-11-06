import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: process.env['TEST_URL'] || 'http://localhost:4000',
  },
});
