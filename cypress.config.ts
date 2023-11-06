import { defineConfig } from 'cypress';

export default defineConfig({
  reporter: 'junit',
  e2e: {
    baseUrl: process.env['TEST_URL'] || 'http://localhost:4000',
  },
});
