import { defineConfig } from 'cypress';
import * as webpack from '@cypress/webpack-preprocessor';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
): Promise<Cypress.PluginConfigOptions> {
  await addCucumberPreprocessorPlugin(on, config);

  on(
    'file:preprocessor',
    webpack({
      webpackOptions: {
        resolve: {
          extensions: ['.ts', '.js'],
        },
        module: {
          rules: [
            {
              test: /\.ts$/,
              exclude: [/node_modules/],
              use: [
                {
                  loader: 'ts-loader',
                },
              ],
            },
            {
              test: /\.feature$/,
              use: [
                {
                  loader: '@badeball/cypress-cucumber-preprocessor/webpack',
                  options: config,
                },
              ],
            },
          ],
        },
      },
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
  config.env['messagesOutput'] =
    `${process.env.TEST_STAGE}-output/prod/cucumber/${process.env.TEST_MODE}-report-${process.env.CYPRESS_THREAD}.ndjson`;
  return config;
}
export default defineConfig({
  viewportWidth: 2560,
  viewportHeight: 2560,
  reporter: 'junit',
  e2e: {
    baseUrl: process.env['TEST_URL'] || 'http://localhost:4000/',
    specPattern: '**/*.feature',
    fixturesFolder: 'cypress/support/fixtures',
    setupNodeEvents,
    retries: {
      runMode: 1,
      openMode: 0,
    },
  },
  experimentalModifyObstructiveThirdPartyCode: true,
  chromeWebSecurity: false,
  env: {
    CYPRESS_TEST_EMAIL: process.env['OPAL_TEST_USER_EMAIL'],
    CYPRESS_TEST_PASSWORD: process.env['OPAL_TEST_USER_PASSWORD'],
    TEST_MODE: process.env['TEST_MODE'] || 'OPAL',
  },
});
