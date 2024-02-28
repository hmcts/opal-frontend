import { defineConfig } from 'cypress';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { preprocessor } from '@badeball/cypress-cucumber-preprocessor/browserify';

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
): Promise<Cypress.PluginConfigOptions> {
  await addCucumberPreprocessorPlugin(on, config);

  on(
    'file:preprocessor',
    preprocessor(config, {
      typescript: require.resolve('typescript'),
    }),
  );
  return config;
}

export default defineConfig({
  reporter: 'junit',
  e2e: {
    baseUrl: process.env['TEST_URL'] || 'http://localhost:4000/',
    specPattern: '**/*.feature',
    setupNodeEvents,
  },
  experimentalModifyObstructiveThirdPartyCode: true,
  chromeWebSecurity: false,
  env: {
    CYPRESS_TEST_EMAIL: process.env['OPAL_TEST_USER_EMAIL'],
    CYPRESS_TEST_PASSWORD: process.env['OPAL_TEST_USER_PASSWORD'],
    TEST_MODE: process.env['TEST_MODE'] || 'OPAL',
    API_URL: process.env['OPAL_API_URL'] || 'http://localhost:4550',
  },
});
