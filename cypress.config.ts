/**
 * @file cypress.config.ts
 * @description Cypress configuration, plugin wiring, and reporting setup for Opal.
 */
import { defineConfig } from 'cypress';
import webpack from '@cypress/webpack-preprocessor';
import {
  addCucumberPreprocessorPlugin,
  beforeRunHandler,
  afterRunHandler,
} from '@badeball/cypress-cucumber-preprocessor';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import * as path from 'node:path';
import {
  ensureAccountCaptureFile,
  initializeAccountCapture,
  registerAccountCaptureTasks,
  resetEvidenceForRun,
  releaseEvidenceResetLock,
} from './cypress/support/tasks/accountCaptureTask';
import { cleanupEmptyScreenshotDirs, registerScreenshotTasks } from './cypress/support/tasks/screenshotTask';

/**
 * Register browser launch hooks to standardize window size in headless runs.
 * @param on - Cypress plugin event emitter.
 * @returns void
 */
function setupBrowserLaunch(on: Cypress.PluginEvents): void {
  on('before:browser:launch', (browser: Cypress.Browser, launchOptions: Cypress.BeforeBrowserLaunchOptions) => {
    // eslint-disable-next-line no-console
    console.log('launching browser %s is headless? %s', browser.name, browser.isHeadless);

    const width = 3640;
    const height = 2560;

    // eslint-disable-next-line no-console
    console.log('setting the browser window size to %d x %d', width, height);

    if (browser.name === 'chrome' && browser.isHeadless) {
      launchOptions.args = [
        ...(launchOptions.args ?? []),
        `--window-size=${width},${height}`,
        '--force-device-scale-factor=1',
      ];
    }

    if (browser.name === 'electron' && browser.isHeadless) {
      launchOptions.preferences = {
        ...launchOptions.preferences,
        width,
        height,
      } as typeof launchOptions.preferences;
    }

    if (browser.name === 'firefox' && browser.isHeadless) {
      launchOptions.args = [...(launchOptions.args ?? []), `--width=${width}`, `--height=${height}`];
    }

    return launchOptions;
  });
}

/**
 * Configure Cypress node event handlers, plugins, and per-run evidence tasks.
 * @param on - Cypress plugin event emitter.
 * @param config - Cypress plugin configuration.
 * @returns Cypress plugin configuration after setup.
 */
async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
): Promise<Cypress.PluginConfigOptions> {
  await addCucumberPreprocessorPlugin(on, config);
  // Evidence reset is handled in before:run with a per-run lock.
  // Register tasks so Cypress can write the per-run created-accounts artifact.
  registerAccountCaptureTasks(on);
  // Register tasks to relocate scenario evidence screenshots.
  registerScreenshotTasks(on, config);

  on(
    'file:preprocessor',
    webpack({
      webpackOptions: {
        // IMPORTANT: use a valid sourcemap mode, not false,
        // to avoid broken Base64 / "length must be multiple of 4" errors.
        devtool: 'eval',
        resolve: {
          extensions: ['.ts', '.js'],
          plugins: [
            new TsconfigPathsPlugin({
              configFile: path.resolve(__dirname, 'e2e.tsconfig.json'),
            }),
          ],
        },
        module: {
          rules: [
            {
              test: /\.ts$/,
              exclude: [/node_modules/, /src/],
              use: [
                {
                  loader: 'ts-loader',
                  options: {
                    configFile: 'e2e.tsconfig.json',
                    // keep transpileOnly to speed up bundling for Cypress
                    transpileOnly: true,
                    compilerOptions: {
                      // TS sourcemaps are optional; Webpack devtool handles
                      // bundle-level sourcemaps for Cucumber.
                      sourceMap: false,
                      inlineSourceMap: false,
                      inlineSources: false,
                    },
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

  // Initialize the artifact at run start and flush it at run end.
  on('before:run', async () => {
    await beforeRunHandler(config);
    await resetEvidenceForRun();
    await initializeAccountCapture();
  });

  // Flush the artifact to disk once the entire run completes.
  on('after:run', async (results) => {
    await ensureAccountCaptureFile();
    await afterRunHandler(config, results);
    await releaseEvidenceResetLock();
    await cleanupEmptyScreenshotDirs(config.screenshotsFolder as string | undefined);
  });

  // messagesOutput logic (unchanged)
  if (process.env.TEST_MODE === 'OPAL' && process.env.BROWSER_TO_RUN === 'chrome') {
    config.env.messagesOutput = `${process.env.TEST_STAGE}-output/prod/cucumber/${process.env.TEST_MODE}-report-${process.env.CYPRESS_THREAD}.ndjson`;
  } else if (process.env.TEST_MODE === 'OPAL' && process.env.BROWSER_TO_RUN !== 'chrome') {
    config.env.messagesOutput = `${process.env.TEST_STAGE}-output/prod/${process.env.BROWSER_TO_RUN}/cucumber/${process.env.TEST_MODE}-report-${process.env.CYPRESS_THREAD}.ndjson`;
  } else if (process.env.TEST_MODE === 'LEGACY') {
    config.env.messagesOutput = `${process.env.TEST_STAGE}-output/prod/legacy/cucumber/${process.env.TEST_MODE}-report-${process.env.CYPRESS_THREAD}.ndjson`;
  }

  return config;
}

export default defineConfig({
  viewportWidth: 2560,
  viewportHeight: 2560,
  reporter: 'junit',
  // Keep failure screenshots in the default functional output location.
  screenshotsFolder: 'functional-output/screenshots/opal',

  e2e: {
    baseUrl: process.env.TEST_URL || 'http://localhost:4000/',
    specPattern: 'cypress/e2e/**/*.feature',
    excludeSpecPattern: [
      '**/*/*.cy.ts',
      'cypress/e2e/DiscoPlus_accountEnquiry/**/*',
      'cypress/e2e/Old_functional_E2E_Tests/**/*',
    ],
    setupNodeEvents,
    retries: { runMode: 1, openMode: 0 },
    // make sure our support file always loads
    supportFile: 'cypress/support/e2e.ts',
  },

  experimentalModifyObstructiveThirdPartyCode: true,
  chromeWebSecurity: false,

  env: {
    CYPRESS_TEST_EMAIL: process.env.OPAL_TEST_USER_EMAIL,
    CYPRESS_TEST_PASSWORD: process.env.OPAL_TEST_USER_PASSWORD,
    TEST_MODE: process.env.TEST_MODE || 'OPAL',
    TAGS: process.env.TAGS || '',
    omitFiltered: true,
    filterSpecs: true,
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
    /**
     * Configure component testing plugins and reporters.
     * @param on - Cypress plugin event emitter.
     * @param config - Cypress plugin configuration.
     * @returns Cypress plugin configuration after setup.
     */
    setupNodeEvents(on, config) {
      setupBrowserLaunch(on);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { plugin: cypressGrepPlugin } = require('@cypress/grep/plugin');
      cypressGrepPlugin(config);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('cypress-mochawesome-reporter/plugin')(on);

      config.env.messagesOutput = `${process.env.TEST_STAGE}-output/prod/cucumber/${process.env.TEST_MODE}-report-${process.env.CYPRESS_THREAD}.ndjson`;
      return config;
    },
  },
});
