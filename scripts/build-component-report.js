#!/usr/bin/env node
'use strict';

/**
 * @fileoverview Builds the Jenkins HTML report for Cypress component test results.
 * @description Used after component runs to merge Mochawesome JSON files for the selected browser and to skip
 * report generation cleanly when no component JSON artifacts were produced. This reads the reporter's `.jsons`
 * output folder directly from the consolidated component artifact tree.
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
 * @returns {{ htmlDir: string, inputDirs: string[] }}
 */
function resolvePaths(browser) {
  return {
    inputDirs: [
      path.join('functional-output', 'component', browser, 'json', '.jsons'),
      path.join('functional-output', 'component', browser, 'json'),
    ],
    htmlDir: path.join('functional-output', 'component', browser, 'html'),
  };
}

/**
 * Return the first report directory that contains Mochawesome JSON files.
 * @param {string[]} inputDirs
 * @returns {{ inputDir: string, reportFiles: string[] }}
 */
function getReportFiles(inputDirs) {
  for (const inputDir of inputDirs) {
    if (!fs.existsSync(inputDir)) {
      continue;
    }

    const reportFiles = fs
      .readdirSync(inputDir)
      .filter((filename) => filename.endsWith('.json'))
      .map((filename) => path.join(inputDir, filename))
      .sort();

    if (reportFiles.length > 0) {
      return { inputDir, reportFiles };
    }
  }

  return { inputDir: '', reportFiles: [] };
}

async function main() {
  const requestedBrowser = parseBrowser(process.argv.slice(2));
  const browser = requestedBrowser || resolveGenericBrowser(process.env.BROWSER_TO_RUN);
  const { inputDirs, htmlDir } = resolvePaths(browser);
  const { inputDir, reportFiles } = getReportFiles(inputDirs);

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
  console.log(`[build-component-report] inputDir=${inputDir}`);
  console.log(`[build-component-report] inputs=${reportFiles.length}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
