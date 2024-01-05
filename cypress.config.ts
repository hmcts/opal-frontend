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
    baseUrl: process.env['TEST_URL'] || 'http://localhost:4200/',
    specPattern: '**/*.feature',
    screenshotsFolder: 'smoke-output/screenshots',
    setupNodeEvents,
  },
  experimentalModifyObstructiveThirdPartyCode: true,
  chromeWebSecurity: false,
});
