import { defineConfig } from 'cypress';
import * as webpack from '@cypress/webpack-preprocessor';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import * as path from 'path';

function setupBrowserLaunch(on) {
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
}

async function setupNodeEvents(on, config) {
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
              // Only .ts files
              test: /\.ts$/,
              // Ignore node_modules and the src folder
              exclude: [/node_modules/, /src/],
              use: [
                {
                  loader: 'ts-loader',
                  options: {
                    configFile: 'e2e.tsconfig.json',
                    transpileOnly: true,
                  },
                },
              ],
            },
            {
              test: /\.feature$/,
              include: [/cypress\/e2e/],
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
  setupBrowserLaunch(on);
  if (process.env.TEST_MODE === 'OPAL' && process.env.BROWSER_TO_RUN === 'chrome') {
    config.env['messagesOutput'] =
      `${process.env.TEST_STAGE}-output/prod/cucumber/${process.env.TEST_MODE}-report-${process.env.CYPRESS_THREAD}.ndjson`;
    return config;
  } else if (process.env.TEST_MODE === 'OPAL' && process.env.BROWSER_TO_RUN !== 'chrome') {
    config.env['messagesOutput'] =
      `${process.env.TEST_STAGE}-output/prod/${process.env.BROWSER_TO_RUN}/cucumber/${process.env.TEST_MODE}-report-${process.env.CYPRESS_THREAD}.ndjson`;
    return config;
  } else if (process.env.TEST_MODE === 'LEGACY') {
    config.env['messagesOutput'] =
      `${process.env.TEST_STAGE}-output/prod/legacy/cucumber/${process.env.TEST_MODE}-report-${process.env.CYPRESS_THREAD}.ndjson`;
    return config;
  }
  return config;
}

export default defineConfig({
  viewportWidth: 2560,
  viewportHeight: 2560,
  reporter: 'junit',

  e2e: {
    baseUrl: process.env['TEST_URL'] || 'http://localhost:4000/',

    specPattern: 'cypress/e2e/**/*.feature',
    excludeSpecPattern: [
      '**/*/*.cy.ts',
      'cypress/e2e/DiscoPlus_accountEnquiry/**/*',
      'cypress/e2e/Old_functional_E2E_Tests/**/*',
    ],

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

  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
      webpackConfig: {
        devServer: {
          port: Number(`809${process.env.CYPRESS_THREAD || '0'}`),
        },
        resolve: {
          extensions: ['.ts', '.js'],
          plugins: [
            new TsconfigPathsPlugin({
              configFile: path.resolve(__dirname, 'tsconfig.cypress.json'),
            }),
          ],
        },
      },
    },
    specPattern: 'cypress/component/**/*.cy.ts',
    reporter: 'cypress-multi-reporters',
    reporterOptions: {
      reporterEnabled: 'cypress-mochawesome-reporter, mocha-junit-reporter',
      mochaJunitReporterReporterOptions: {
        mochaFile: 'functional-output/prod/component-test-output-[hash].xml',
        toConsole: false,
      },
      cypressMochawesomeReporterReporterOptions: {
        reportDir: 'functional-output/component-report',
        overwrite: false,
        html: false,
        json: true,
      },
    },
    setupNodeEvents(on, config) {
      setupBrowserLaunch(on);
      require('@cypress/grep/src/plugin')(config);
      require('cypress-mochawesome-reporter/plugin')(on);

      config.env['messagesOutput'] =
        `${process.env.TEST_STAGE}-output/prod/cucumber/${process.env.TEST_MODE}-report-${process.env.CYPRESS_THREAD}.ndjson`;
      return config;
    },
  },
});
