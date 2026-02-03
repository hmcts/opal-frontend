#!/usr/bin/env node
/**
 * @fileoverview Orchestrates Opal functional test runs with consistent browser selection and report combining.
 * @description Used by `yarn test:functional` and `yarn test:functional:tags` in both local and CI environments.
 */
'use strict';

const { spawnSync } = require('node:child_process');

const args = process.argv.slice(2);
const withTags = args.includes('--tags');

/**
 * Resolve the browser under test, defaulting to chrome when unset.
 * @returns {string} Normalized browser name.
 */
const resolveBrowser = () => {
  const raw = (process.env.BROWSER_TO_RUN || '').trim().toLowerCase();
  return raw || 'chrome';
};

const browser = resolveBrowser();
process.env.BROWSER_TO_RUN = browser;

if (withTags) {
  if (!process.env.CYPRESS_TAGS && process.env.TAGS) {
    process.env.CYPRESS_TAGS = process.env.TAGS;
  }
  process.env.CYPRESS_filterSpecs = process.env.CYPRESS_filterSpecs || 'true';
  process.env.CYPRESS_filterSpecsMixedMode = process.env.CYPRESS_filterSpecsMixedMode || 'hide';
}

const yarnCmd = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';

/**
 * Execute a yarn script and return its exit code.
 * @param {string} scriptName - The yarn script name to execute.
 * @returns {number} Exit status for the yarn script.
 */
const runYarn = (scriptName) => {
  const result = spawnSync(yarnCmd, [scriptName], { stdio: 'inherit', env: process.env });
  if (typeof result.status === 'number') {
    return result.status;
  }
  return result.error ? 1 : 0;
};

const testExitCode = runYarn('test:functionalOpalParallel');
runYarn('test:functional:combine:reports');

const cucumberScript =
  browser === 'edge'
    ? 'test:functionalEdge:cucumber:combineParallelReport'
    : browser === 'firefox'
      ? 'test:functionalFirefox:cucumber:combineParallelReport'
      : 'test:functional:cucumber:combineParallelReport';

runYarn(cucumberScript);

process.exit(testExitCode || 0);
