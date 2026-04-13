#!/usr/bin/env node
'use strict';

/**
 * @fileoverview Runs Cypress suites with a consistent suite/browser/mode/parallel matrix.
 * @description Handles component, smoke, functional, and fullfunctional entry points so top-level scripts always
 * generate the expected reports after execution instead of scattering combine logic across many package scripts.
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { normalizeBrowser, resolveGenericBrowser, requireInstalledBrowser } = require('./browser-support');

const yarnCommand = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';
const nodeCommand = process.execPath;

/**
 * Parse CLI arguments into runner options and passthrough Cypress arguments.
 * @param {string[]} argv
 * @returns {{
 *   suite: string,
 *   browser: string,
 *   mode: string,
 *   parallel: boolean | null,
 *   tags: boolean,
 *   reset: boolean | null,
 *   noReports: boolean,
 *   passthroughArgs: string[],
 * }}
 */
function parseArgs(argv) {
  const options = {
    suite: '',
    browser: '',
    mode: '',
    parallel: null,
    tags: false,
    reset: null,
    noReports: false,
    passthroughArgs: [],
  };

  const valueFlags = new Set(['--spec', '--config', '--env', '--reporter', '--reporter-options']);

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (!options.suite && !arg.startsWith('--')) {
      options.suite = arg.trim().toLowerCase();
      continue;
    }

    if (arg === '--parallel') {
      options.parallel = true;
      continue;
    }

    if (arg === '--serial') {
      options.parallel = false;
      continue;
    }

    if (arg === '--tags') {
      options.tags = true;
      continue;
    }

    if (arg === '--reset') {
      options.reset = true;
      continue;
    }

    if (arg === '--no-reset') {
      options.reset = false;
      continue;
    }

    if (arg === '--no-reports') {
      options.noReports = true;
      continue;
    }

    if (arg.startsWith('--browser=')) {
      options.browser = arg.split('=')[1] || '';
      continue;
    }

    if (arg === '--browser') {
      options.browser = argv[index + 1] || '';
      index += 1;
      continue;
    }

    if (arg.startsWith('--mode=')) {
      options.mode = arg.split('=')[1] || '';
      continue;
    }

    if (arg === '--mode') {
      options.mode = argv[index + 1] || '';
      index += 1;
      continue;
    }

    options.passthroughArgs.push(arg);

    if (valueFlags.has(arg) && index + 1 < argv.length) {
      options.passthroughArgs.push(argv[index + 1]);
      index += 1;
    }
  }

  return options;
}

/**
 * Normalize the requested test mode.
 * @param {string} mode
 * @returns {'opal' | 'legacy'}
 */
function normalizeMode(mode) {
  const normalizedMode = String(mode || process.env.TEST_MODE || 'OPAL')
    .trim()
    .toLowerCase();

  if (!normalizedMode || normalizedMode === 'opal') {
    return 'opal';
  }

  if (normalizedMode === 'legacy') {
    return 'legacy';
  }

  throw new Error(`Unsupported TEST_MODE requested: ${mode}`);
}

/**
 * Resolve the requested browser, validating explicit requests.
 * @param {string} browser
 * @returns {string}
 */
function resolveBrowser(browser) {
  const normalizedBrowser = normalizeBrowser(browser);

  if (normalizedBrowser) {
    return requireInstalledBrowser(normalizedBrowser);
  }

  return resolveGenericBrowser(process.env.BROWSER_TO_RUN);
}

/**
 * Execute a child command and return its exit code.
 * @param {string} command
 * @param {string[]} args
 * @param {NodeJS.ProcessEnv} env
 * @returns {number}
 */
function runCommand(command, args, env) {
  const result = spawnSync(command, args, {
    env,
    stdio: 'inherit',
  });

  if (typeof result.status === 'number') {
    return result.status;
  }

  return result.error ? 1 : 0;
}

/**
 * Execute a locally installed CLI via `yarn exec`.
 * @param {string} toolName
 * @param {string[]} args
 * @param {NodeJS.ProcessEnv} env
 * @returns {number}
 */
function runYarnTool(toolName, args, env) {
  return runCommand(yarnCommand, ['exec', toolName, ...args], env);
}

/**
 * Remove generated Cypress outputs.
 */
function resetOutputs() {
  for (const outputDir of ['functional-output', 'smoke-output']) {
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
  }
}

/**
 * Return a sorted list of files with the requested extension.
 * @param {string} directory
 * @param {string} extension
 * @returns {string[]}
 */
function listFiles(directory, extension) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((filename) => filename.endsWith(extension))
    .map((filename) => path.join(directory, filename))
    .sort();
}

/**
 * Return whether the argument list already overrides a Cypress option.
 * @param {string[]} args
 * @param {string} optionName
 * @returns {boolean}
 */
function hasOption(args, optionName) {
  return args.some((arg) => arg === optionName || arg.startsWith(`${optionName}=`));
}

/**
 * Return the value for an option from passthrough args.
 * Supports both `--option value` and `--option=value` forms.
 * @param {string[]} args
 * @param {string} optionName
 * @returns {string}
 */
function getOptionValue(args, optionName) {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === optionName) {
      return args[index + 1] || '';
    }

    if (arg.startsWith(`${optionName}=`)) {
      return arg.slice(optionName.length + 1);
    }
  }

  return '';
}

/**
 * Remove an option and its value from passthrough args.
 * Supports both `--option value` and `--option=value` forms.
 * @param {string[]} args
 * @param {string} optionName
 * @returns {string[]}
 */
function removeOption(args, optionName) {
  const filteredArgs = [];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === optionName) {
      index += 1;
      continue;
    }

    if (arg.startsWith(`${optionName}=`)) {
      continue;
    }

    filteredArgs.push(arg);
  }

  return filteredArgs;
}

/**
 * Apply shared environment settings for the selected suite.
 * @param {NodeJS.ProcessEnv} env
 * @param {{ mode: 'opal' | 'legacy', suite: string, tags: boolean }} context
 */
function applyRunnerEnv(env, context) {
  env.TEST_MODE = context.mode.toUpperCase();

  if (context.mode === 'legacy') {
    env.LEGACY_ENABLED = 'true';
  }

  if (context.suite === 'functional' || context.suite === 'smoke') {
    env.TEST_STAGE = context.suite;
    env.CYPRESS_messagesEnabled = env.CYPRESS_messagesEnabled || 'true';
  } else if (context.suite === 'component') {
    env.TEST_STAGE = 'component';
  }

  const tagExpression = String(env.CYPRESS_TAGS || env.TAGS || '').trim();
  if ((context.tags || tagExpression) && context.suite !== 'component') {
    if (!env.CYPRESS_TAGS && env.TAGS) {
      env.CYPRESS_TAGS = env.TAGS;
    }
    env.CYPRESS_filterSpecs = env.CYPRESS_filterSpecs || 'true';
    env.CYPRESS_filterSpecsMixedMode = env.CYPRESS_filterSpecsMixedMode || 'hide';
  }
}

/**
 * Return the effective default for parallel execution.
 * @param {string} suite
 * @param {boolean | null} requestedParallel
 * @returns {boolean}
 */
function resolveParallelMode(suite, requestedParallel) {
  if (requestedParallel !== null) {
    return requestedParallel;
  }

  return suite === 'smoke' || suite === 'functional';
}

/**
 * Resolve suite configuration for execution and reporting.
 * @param {{ suite: string, mode: 'opal' | 'legacy', browser: string }} options
 * @returns {object}
 */
function buildSuiteConfig(options) {
  const { suite, mode, browser } = options;
  const isLegacy = mode === 'legacy';

  if (suite === 'component') {
    return {
      suite,
      mode,
      browser,
      outputRoot: 'functional-output',
      leafScript: 'test:component:leaf',
      specPattern: 'cypress/component/**/**.cy.ts',
      screenshotsFolder: `functional-output/component/${browser}/screenshots`,
      componentJsonDir: `functional-output/component/${browser}/json`,
      junitDir: `functional-output/component/${browser}/junit`,
      junitMochaFile: `functional-output/component/${browser}/junit/component-test-output-[hash].xml`,
      threads: 3,
      weightsJson: 'cypress/parallel/weights/component-parallel-weights.json',
      isComponent: true,
      isLegacy: false,
      combinedXmlPath: '',
      combinedXmlCopyPath: '',
      cucumberDir: '',
      cucumberSuite: '',
    };
  }

  const outputRoot = suite === 'smoke' ? 'smoke-output' : 'functional-output';
  const specPattern =
    suite === 'smoke'
      ? isLegacy
        ? 'cypress/e2e/smoke/legacy/**/*.feature'
        : 'cypress/e2e/smoke/opal/**/*.feature'
      : (process.env.TEST_SPECS || '').trim() || 'cypress/e2e/functional/opal/**/*.feature';

  const screenshotsFolder = isLegacy
    ? `${outputRoot}/screenshots/${browser}/legacy`
    : `${outputRoot}/screenshots/${browser}`;
  const junitDir = isLegacy ? `${outputRoot}/prod/${browser}/legacy` : `${outputRoot}/prod/${browser}`;
  const junitMochaFile = isLegacy
    ? `${junitDir}/legacy-mode-test-output-[hash].xml`
    : `${junitDir}/opal-mode-test-output-[hash].xml`;
  const combinedXmlPath = isLegacy
    ? `${junitDir}/legacy-test-result.xml`
    : `${outputRoot}/prod/${browser}/${browser}-test-result.xml`;
  const combinedXmlCopyPath = isLegacy ? '' : `${outputRoot}/prod/test-result.xml`;
  const cucumberDir = `${junitDir}/cucumber`;
  const weightsJson =
    suite === 'smoke'
      ? 'cypress/parallel/weights/smoke-parallel-weights.json'
      : 'cypress/parallel/weights/functional-parallel-weights.json';

  return {
    suite,
    mode,
    browser,
    outputRoot,
    leafScript: `test:${suite}:leaf`,
    specPattern,
    screenshotsFolder,
    componentJsonDir: '',
    junitDir,
    junitMochaFile,
    threads: suite === 'smoke' ? 2 : 3,
    weightsJson,
    isComponent: false,
    isLegacy,
    combinedXmlPath,
    combinedXmlCopyPath,
    cucumberDir,
    cucumberSuite: suite,
  };
}

/**
 * Execute a suite serially via Cypress.
 * @param {ReturnType<typeof buildSuiteConfig>} config
 * @param {NodeJS.ProcessEnv} env
 * @param {string[]} passthroughArgs
 * @returns {number}
 */
function runSerialSuite(config, env, passthroughArgs) {
  const commandArgs = ['run', '--browser', config.browser];

  if (config.isComponent) {
    commandArgs.push('--component');
  }

  if (!hasOption(passthroughArgs, '--spec')) {
    commandArgs.push('--spec', config.specPattern);
  }

  commandArgs.push('--config', `screenshotsFolder=${config.screenshotsFolder}`);

  if (!config.isComponent && !hasOption(passthroughArgs, '--reporter-options')) {
    commandArgs.push('--reporter-options', `mochaFile=${config.junitMochaFile}`);
  }

  commandArgs.push(...passthroughArgs);

  return runYarnTool('cypress', commandArgs, env);
}

/**
 * Create a cypress-parallel reporter config that preserves component HTML and Zephyr artifacts.
 * @param {ReturnType<typeof buildSuiteConfig>} config
 * @returns {string}
 */
function createComponentParallelReporterConfig(config) {
  const reporterConfigPath = path.join(os.tmpdir(), `opal-component-parallel-${config.browser}.json`);
  const reporterConfig = {
    reporterEnabled:
      'cypress-parallel/json-stream.reporter.js,cypress-mochawesome-reporter,mocha-junit-reporter,@hmcts/zephyr-automation-nodejs/cypress/ZephyrReporter',
    mochaJunitReporterReporterOptions: {
      mochaFile: config.junitMochaFile,
      toConsole: false,
    },
    cypressMochawesomeReporterReporterOptions: {
      reportDir: config.componentJsonDir,
      overwrite: false,
      html: false,
      json: true,
    },
  };

  fs.writeFileSync(reporterConfigPath, JSON.stringify(reporterConfig, null, 2));
  return reporterConfigPath;
}

/**
 * Execute a suite in parallel via cypress-parallel.
 * @param {ReturnType<typeof buildSuiteConfig>} config
 * @param {NodeJS.ProcessEnv} env
 * @param {string[]} passthroughArgs
 * @returns {number}
 */
function runParallelSuite(config, env, passthroughArgs) {
  const specOverride = getOptionValue(passthroughArgs, '--spec');
  const forwardedArgs = removeOption(passthroughArgs, '--spec');
  const commandArgs = ['-s', config.leafScript, '-m', 'false', '-t', String(config.threads)];

  if (specOverride) {
    if (specOverride.includes('*')) {
      commandArgs.push('-d', specOverride);
    } else {
      commandArgs.push('--spec', specOverride);
    }
  } else {
    commandArgs.push('-d', config.specPattern);
  }

  if (config.weightsJson) {
    commandArgs.push('-w', config.weightsJson);
  }

  if (config.isComponent) {
    commandArgs.push('-p', createComponentParallelReporterConfig(config));
  } else {
    commandArgs.push('-r', 'mocha-junit-reporter', '-o', `mochaFile=${config.junitMochaFile}`);
  }

  if (forwardedArgs.length > 0) {
    commandArgs.push('-a', forwardedArgs.join(' '));
  }

  return runYarnTool('cypress-parallel', commandArgs, env);
}

/**
 * Return whether a smoke run should be skipped entirely.
 * @param {NodeJS.ProcessEnv} env
 * @param {string} suite
 * @returns {boolean}
 */
function shouldSkipSuite(env, suite) {
  if (suite !== 'smoke') {
    return false;
  }

  return (
    String(env.SKIP_SMOKE || '')
      .trim()
      .toLowerCase() === 'true'
  );
}

/**
 * Merge JUnit XML files into the suite summary output.
 * @param {ReturnType<typeof buildSuiteConfig>} config
 * @param {NodeJS.ProcessEnv} env
 * @returns {number}
 */
function mergeJUnitReports(config, env) {
  const excludedFilename = path.basename(config.combinedXmlPath);
  const xmlFiles = listFiles(config.junitDir, '.xml').filter(
    (filePath) => path.basename(filePath) !== excludedFilename,
  );

  if (xmlFiles.length === 0) {
    return 0;
  }

  const exitCode = runYarnTool('jrm', [config.combinedXmlPath, ...xmlFiles], env);
  if (exitCode !== 0) {
    return exitCode;
  }

  if (config.combinedXmlCopyPath) {
    fs.mkdirSync(path.dirname(config.combinedXmlCopyPath), { recursive: true });
    fs.copyFileSync(config.combinedXmlPath, config.combinedXmlCopyPath);
  }

  return 0;
}

/**
 * Build the suite's combined Cucumber report outputs.
 * @param {ReturnType<typeof buildSuiteConfig>} config
 * @param {NodeJS.ProcessEnv} env
 * @returns {number}
 */
function buildCucumberReports(config, env) {
  return runCommand(
    nodeCommand,
    ['scripts/build-cucumber-report.js', config.cucumberSuite, `--browser=${config.browser}`, `--mode=${config.mode}`],
    env,
  );
}

/**
 * Build the component HTML report.
 * @param {string} browser
 * @param {NodeJS.ProcessEnv} env
 * @returns {number}
 */
function buildComponentReport(browser, env) {
  return runCommand(nodeCommand, ['scripts/build-component-report.js', `--browser=${browser}`], env);
}

/**
 * Return whether the selected suite produced JUnit or ndjson artifacts.
 * @param {ReturnType<typeof buildSuiteConfig>} config
 * @returns {{ hasNdjson: boolean, hasXml: boolean }}
 */
function getSuiteArtifacts(config) {
  return {
    hasXml: listFiles(config.junitDir, '.xml').length > 0,
    hasNdjson: listFiles(config.cucumberDir, '.ndjson').length > 0,
  };
}

/**
 * Execute one suite and combine reports when appropriate.
 * @param {string} suite
 * @param {ReturnType<typeof parseArgs>} options
 * @param {NodeJS.ProcessEnv} baseEnv
 * @returns {number}
 */
function executeSuite(suite, options, baseEnv) {
  const env = { ...baseEnv };
  const mode = normalizeMode(options.mode);
  const browser = resolveBrowser(options.browser);
  const config = buildSuiteConfig({ suite, mode, browser });

  env.BROWSER_TO_RUN = browser;
  applyRunnerEnv(env, { mode, suite, tags: options.tags });

  if (options.reset === true || (options.reset === null && suite === 'component')) {
    resetOutputs();
  }

  if (shouldSkipSuite(env, suite)) {
    console.log('[run-test-suite] skipping smoke stage because SKIP_SMOKE=true.');
    return 0;
  }

  const parallel = resolveParallelMode(suite, options.parallel);
  const testExitCode = parallel
    ? runParallelSuite(config, env, options.passthroughArgs)
    : runSerialSuite(config, env, options.passthroughArgs);

  if (options.noReports) {
    return testExitCode;
  }

  if (config.isComponent) {
    const reportExitCode = buildComponentReport(browser, env);
    return testExitCode || reportExitCode || 0;
  }

  const { hasXml, hasNdjson } = getSuiteArtifacts(config);
  const hasTagFiltering = Boolean(String(env.CYPRESS_TAGS || env.TAGS || '').trim());

  if (!hasXml && !hasNdjson) {
    if (testExitCode === 0 && hasTagFiltering) {
      console.log(`[run-test-suite] no ${suite} scenarios matched the active tag filter; skipping report generation.`);
      return 0;
    }

    return testExitCode;
  }

  const combineXmlExitCode = hasXml ? mergeJUnitReports(config, env) : 0;
  const cucumberExitCode = hasNdjson ? buildCucumberReports(config, env) : 0;

  return testExitCode || combineXmlExitCode || cucumberExitCode || 0;
}

/**
 * Execute the combined component + functional workflow.
 * @param {ReturnType<typeof parseArgs>} options
 * @param {NodeJS.ProcessEnv} baseEnv
 * @returns {number}
 */
function executeFullFunctional(options, baseEnv) {
  resetOutputs();

  const componentParallel = options.parallel === true;
  const functionalParallel = options.parallel === false ? false : true;

  const componentExitCode = executeSuite(
    'component',
    {
      ...options,
      parallel: componentParallel,
      reset: false,
    },
    baseEnv,
  );

  const functionalExitCode = executeSuite(
    'functional',
    {
      ...options,
      parallel: functionalParallel,
      reset: false,
    },
    baseEnv,
  );

  return componentExitCode || functionalExitCode || 0;
}

function main() {
  const options = parseArgs(process.argv.slice(2));

  if (!options.suite) {
    throw new Error('A suite is required: component, smoke, functional, or fullfunctional');
  }

  if (options.suite === 'fullfunctional') {
    process.exit(executeFullFunctional(options, process.env));
  }

  if (!['component', 'smoke', 'functional'].includes(options.suite)) {
    throw new Error(`Unsupported suite requested: ${options.suite}`);
  }

  process.exit(executeSuite(options.suite, options, process.env));
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
