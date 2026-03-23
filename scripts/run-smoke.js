#!/usr/bin/env node
'use strict';

/**
 * @fileoverview Orchestrates smoke test runs with tag-aware report handling.
 * @description Used by `yarn test:smoke` so tagged reruns that match no smoke scenarios skip report merging cleanly
 * instead of failing on missing JUnit or Cucumber artifacts.
 */

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { resolveGenericBrowser } = require('./browser-support');

const browser = resolveGenericBrowser(process.env.BROWSER_TO_RUN);
const tagExpression = (process.env.CYPRESS_TAGS || process.env.TAGS || '').trim();
const hasTagFiltering = Boolean(tagExpression);
const skipSmoke = String(process.env.SKIP_SMOKE || '').trim().toLowerCase() === 'true';
const yarnCmd = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';

process.env.BROWSER_TO_RUN = browser;

if (skipSmoke) {
  console.log('[run-smoke] skipping smoke stage because run_tag reruns target functional coverage only.');
  process.exit(0);
}

/**
 * Execute a yarn script and return its exit status.
 * @param {string} scriptName
 * @returns {number}
 */
function runYarn(scriptName) {
  const result = spawnSync(yarnCmd, [scriptName], { env: process.env, stdio: 'inherit' });

  if (typeof result.status === 'number') {
    return result.status;
  }

  return result.error ? 1 : 0;
}

/**
 * Return whether the given directory contains files with the provided extension.
 * @param {string} dirPath
 * @param {string} extension
 * @returns {boolean}
 */
function hasFilesWithExtension(dirPath, extension) {
  if (!fs.existsSync(dirPath)) {
    return false;
  }

  return fs.readdirSync(dirPath).some((filename) => filename.endsWith(extension));
}

/**
 * Return whether smoke artifacts were produced for the selected browser.
 * @param {string} resolvedBrowser
 * @returns {{ hasXml: boolean, hasNdjson: boolean }}
 */
function getSmokeArtifacts(resolvedBrowser) {
  const smokeDir = path.join('smoke-output', 'prod', resolvedBrowser);
  const cucumberDir = path.join(smokeDir, 'cucumber');

  return {
    hasXml: hasFilesWithExtension(smokeDir, '.xml'),
    hasNdjson: hasFilesWithExtension(cucumberDir, '.ndjson'),
  };
}

const testExitCode = runYarn('test:smokeOpalParallel');
const { hasXml, hasNdjson } = getSmokeArtifacts(browser);

if (!hasXml && !hasNdjson) {
  if (testExitCode === 0 && hasTagFiltering) {
    console.log(`[run-smoke] no smoke scenarios matched TAGS=${tagExpression}; skipping smoke report generation.`);
    process.exit(0);
  }

  process.exit(testExitCode);
}

const combineReportsExitCode = hasXml ? runYarn('test:smoke:combine:reports') : 0;
const combineCucumberExitCode = hasNdjson ? runYarn('test:smoke:cucumber:combineParallelReport') : 0;

process.exit(testExitCode || combineReportsExitCode || combineCucumberExitCode || 0);
