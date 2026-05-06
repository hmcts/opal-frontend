#!/usr/bin/env node
'use strict';

/**
 * @fileoverview Runs a sequence of yarn scripts and returns the first non-zero exit code.
 * @description Optionally validates that an explicitly requested browser is installed before running the sequence.
 */

const { spawnSync } = require('node:child_process');
const { requireInstalledBrowser } = require('@hmcts/opal-frontend-common-cypress');

const rawArgs = process.argv.slice(2);
const scriptsToRun = [];
let requiredBrowser = '';

for (const arg of rawArgs) {
  if (arg.startsWith('--require-browser=')) {
    requiredBrowser = arg.split('=')[1] || '';
    continue;
  }

  scriptsToRun.push(arg);
}

if (requiredBrowser) {
  try {
    requireInstalledBrowser(requiredBrowser);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

const yarnCmd = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';
let firstFailureCode = 0;

for (const scriptName of scriptsToRun) {
  const result = spawnSync(yarnCmd, [scriptName], {
    env: process.env,
    stdio: 'inherit',
  });

  if (typeof result.status === 'number' && result.status !== 0 && firstFailureCode === 0) {
    firstFailureCode = result.status;
  } else if (result.error && firstFailureCode === 0) {
    firstFailureCode = 1;
  }
}

process.exit(firstFailureCode);
