#!/usr/bin/env node
'use strict';

/**
 * @fileoverview Shared browser detection and selection helpers for local scripts and Jenkins runs.
 * @description Handles installed-browser checks, explicit browser validation, and the default Edge-to-Chrome fallback.
 */

const fs = require('node:fs');
const { spawnSync } = require('node:child_process');

const browserChrome = 'chrome';
const browserEdge = 'edge';
const browserFirefox = 'firefox';
const defaultBrowser = browserEdge;

const browserChecks = {
  [browserChrome]: {
    commands: ['google-chrome', 'google-chrome-stable', 'chrome'],
    executablePaths: ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'],
  },
  [browserEdge]: {
    commands: ['microsoft-edge', 'microsoft-edge-stable', 'msedge'],
    executablePaths: ['/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'],
  },
  [browserFirefox]: {
    commands: ['firefox', 'firefox-bin'],
    executablePaths: ['/Applications/Firefox.app/Contents/MacOS/firefox'],
  },
};

/**
 * Normalize a browser name from script input or environment variables.
 * @param {string | undefined | null} browser
 * @returns {string}
 */
function normalizeBrowser(browser) {
  return String(browser || '')
    .trim()
    .toLowerCase();
}

/**
 * Return whether the given executable path exists and is runnable.
 * @param {string} filePath
 * @returns {boolean}
 */
function isExecutable(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Return whether a command is available on the current machine.
 * @param {string} commandName
 * @returns {boolean}
 */
function hasCommand(commandName) {
  const lookupCommand = process.platform === 'win32' ? 'where' : 'which';
  return spawnSync(lookupCommand, [commandName], { stdio: 'ignore' }).status === 0;
}

/**
 * Return whether the given browser is supported by the browser helper.
 * @param {string} browser
 * @returns {boolean}
 */
function isSupportedBrowser(browser) {
  return Object.hasOwn(browserChecks, browser);
}

/**
 * Return whether the given browser is installed on the current machine.
 * @param {string} browser
 * @returns {boolean}
 */
function isBrowserInstalled(browser) {
  const normalizedBrowser = normalizeBrowser(browser);
  const checks = browserChecks[normalizedBrowser];

  if (!checks) {
    return false;
  }

  return checks.commands.some(hasCommand) || checks.executablePaths.some(isExecutable);
}

/**
 * Build a prominent browser error banner for CI and local runs.
 * @param {string[]} lines
 * @returns {string}
 */
function formatBanner(lines) {
  const divider = '========================================================================';
  return [divider, ...lines, divider].join('\n');
}

/**
 * Ensure an explicit browser request is available on the current machine.
 * @param {string} browser
 * @returns {string}
 */
function requireInstalledBrowser(browser) {
  const normalizedBrowser = normalizeBrowser(browser);

  if (!isSupportedBrowser(normalizedBrowser)) {
    throw new Error(formatBanner([`UNSUPPORTED BROWSER REQUESTED: ${normalizedBrowser || '(empty)'}`]));
  }

  if (!isBrowserInstalled(normalizedBrowser)) {
    throw new Error(
      formatBanner([
        `${normalizedBrowser.toUpperCase()} IS NOT INSTALLED ON THIS MACHINE`,
        `INSTALL ${normalizedBrowser.toUpperCase()} OR USE A DIFFERENT BROWSER`,
      ]),
    );
  }

  return normalizedBrowser;
}

/**
 * Resolve the browser for generic runs, falling back from Edge to Chrome only.
 * @param {string | undefined | null} browser
 * @returns {string}
 */
function resolveGenericBrowser(browser) {
  const requestedBrowser = normalizeBrowser(browser) || defaultBrowser;

  if (!isSupportedBrowser(requestedBrowser)) {
    throw new Error(formatBanner([`UNSUPPORTED BROWSER REQUESTED: ${requestedBrowser}`]));
  }

  if (requestedBrowser === browserEdge) {
    if (isBrowserInstalled(browserEdge)) {
      return browserEdge;
    }

    if (isBrowserInstalled(browserChrome)) {
      console.error(formatBanner(['EDGE IS NOT INSTALLED ON THIS MACHINE', 'SWITCHING TO CHROME FOR THIS RUN']));
      return browserChrome;
    }

    throw new Error(
      formatBanner(['EDGE IS NOT INSTALLED ON THIS MACHINE', 'CHROME IS ALSO NOT AVAILABLE AS A FALLBACK']),
    );
  }

  return requireInstalledBrowser(requestedBrowser);
}

module.exports = {
  browserChrome,
  browserEdge,
  browserFirefox,
  defaultBrowser,
  isBrowserInstalled,
  normalizeBrowser,
  requireInstalledBrowser,
  resolveGenericBrowser,
};
