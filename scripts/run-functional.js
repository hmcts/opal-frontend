#!/usr/bin/env node
/**
 * @fileoverview Orchestrates Opal functional test runs with consistent browser selection and report combining.
 * @description Used by `yarn test:functional` and `yarn test:functional:tags` in both local and CI environments.
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { resolveGenericBrowser } = require('./browser-support');

const args = process.argv.slice(2);
const withTags = args.includes('--tags');
const tagExpression = (process.env.CYPRESS_TAGS || process.env.TAGS || '').trim();
const browser = resolveGenericBrowser(process.env.BROWSER_TO_RUN);
process.env.BROWSER_TO_RUN = browser;
process.env.TEST_SPECS = (process.env.TEST_SPECS || '').trim() || 'cypress/e2e/functional/opal/**/*.feature';
console.log(`[run-functional] TEST_SPECS=${process.env.TEST_SPECS}`);

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

/**
 * Return whether the given directory contains files with the provided extension.
 * @param {string} dirPath
 * @param {string} extension
 * @returns {boolean}
 */
const hasFilesWithExtension = (dirPath, extension) => {
  if (!fs.existsSync(dirPath)) {
    return false;
  }

  return fs.readdirSync(dirPath).some((filename) => filename.endsWith(extension));
};

/**
 * Return whether functional artifacts were produced for the selected browser.
 * @param {string} resolvedBrowser
 * @returns {{ hasXml: boolean, hasNdjson: boolean }}
 */
const getFunctionalArtifacts = (resolvedBrowser) => {
  const functionalDir = path.join('functional-output', 'prod', resolvedBrowser);
  const cucumberDir = path.join(functionalDir, 'cucumber');

  return {
    hasXml: hasFilesWithExtension(functionalDir, '.xml'),
    hasNdjson: hasFilesWithExtension(cucumberDir, '.ndjson'),
  };
};

const parallelScript = withTags ? 'test:functionalOpalParallel:tagged' : 'test:functionalOpalParallel';

const testExitCode = runYarn(parallelScript);
const { hasXml, hasNdjson } = getFunctionalArtifacts(browser);

if (!hasXml && !hasNdjson) {
  if (testExitCode === 0 && withTags) {
    console.log(`[run-functional] no functional scenarios matched TAGS=${tagExpression}; skipping report generation.`);
    process.exit(0);
  }

  console.error('[run-functional] no functional test artifacts were produced; treating the run as failed.');
  process.exit(testExitCode || 1);
}

const combineReportsExitCode = hasXml ? runYarn('test:functional:combine:reports') : 0;
const combineCucumberExitCode = hasNdjson ? runYarn('test:functional:cucumber:combineParallelReport') : 0;

process.exit(testExitCode || combineReportsExitCode || combineCucumberExitCode || 0);
