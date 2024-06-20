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
  on('before:browser:launch', (browser, launchOptions) => {
    console.log('launching browser %s is headless? %s', browser.name, browser.isHeadless);

    const width = 3640;
    const height = 2560;

    console.log('setting the browser window size to %d x %d', width, height);

    if (browser.name === 'chrome' && browser.isHeadless) {
      launchOptions.args.push(`--window-size=${width},${height}`);

      launchOptions.args.push('--force-device-scale-factor=1');
    }

    if (browser.name === 'electron' && browser.isHeadless) {
      launchOptions.preferences.width = width;
      launchOptions.preferences.height = height;
    }

    if (browser.name === 'firefox' && browser.isHeadless) {
      launchOptions.args.push(`--width=${width}`);
      launchOptions.args.push(`--height=${height}`);
    }

    return launchOptions;
  });
  return config;
}
export default defineConfig({
  viewportWidth: 2560,
  viewportHeight: 2560,
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
  },
});
