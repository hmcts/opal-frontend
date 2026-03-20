#!/usr/bin/env node
'use strict';

/**
 * @fileoverview Builds the Jenkins HTML report for Cypress component test results.
 * @description Used after component runs to merge Mochawesome JSON files for the selected browser and to skip
 * report generation cleanly when no component JSON artifacts were produced.
 */

const fs = require('node:fs');
const path = require('node:path');
const { merge } = require('mochawesome-merge');
const { createSync } = require('mochawesome-report-generator');
const { normalizeBrowser, resolveGenericBrowser } = require('./browser-support');

/**
 * Parse the requested browser from CLI arguments.
 * @param {string[]} args
 * @returns {string}
 */
function parseBrowser(args) {
  const browserArg = args.find((arg) => arg.startsWith('--browser='));
  if (!browserArg) {
    return '';
  }

  return normalizeBrowser(browserArg.split('=')[1]);
}

/**
 * Return the component report paths for the selected browser.
 * @param {string} browser
 * @returns {{ htmlDir: string, inputDir: string }}
 */
function resolvePaths(browser) {
  return {
    inputDir: path.join('functional-output', 'component-report', browser),
    htmlDir: path.join('functional-output', 'component-html', browser),
  };
}

/**
 * Return the Mochawesome JSON files for the selected browser.
 * @param {string} inputDir
 * @returns {string[]}
 */
function getReportFiles(inputDir) {
  if (!fs.existsSync(inputDir)) {
    return [];
  }

  return fs
    .readdirSync(inputDir)
    .filter((filename) => filename.endsWith('.json'))
    .map((filename) => path.join(inputDir, filename))
    .sort();
}

async function main() {
  const requestedBrowser = parseBrowser(process.argv.slice(2));
  const browser = requestedBrowser || resolveGenericBrowser(process.env.BROWSER_TO_RUN);
  const { inputDir, htmlDir } = resolvePaths(browser);
  const reportFiles = getReportFiles(inputDir);

  if (reportFiles.length === 0) {
    console.log(
      `[build-component-report] no Mochawesome JSON files found for ${browser}; skipping HTML report generation.`,
    );
    return;
  }

  const mergedReport = await merge({ files: reportFiles });
  createSync(mergedReport, {
    inline: false,
    overwrite: true,
    reportDir: htmlDir,
    reportFilename: 'component-report',
    saveHtml: true,
    saveJson: false,
  });

  console.log(`[build-component-report] browser=${browser}`);
  console.log(`[build-component-report] inputs=${reportFiles.length}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
