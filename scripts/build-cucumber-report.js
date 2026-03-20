#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { Readable } = require('node:stream');
const { pipeline } = require('node:stream/promises');
const {
  resolveGenericBrowser,
  normalizeBrowser,
} = require('./browser-support');

const {
  mergeMessages,
} = require('../node_modules/@badeball/cypress-cucumber-preprocessor/dist/helpers/merge.js');
const {
  createHtmlStream,
  createJsonFormatter,
} = require('../node_modules/@badeball/cypress-cucumber-preprocessor/dist/helpers/formatters.js');

/**
 * Parse CLI arguments into a simple key-value object.
 * @param {string[]} args
 * @returns {{ suite: string, browser: string }}
 */
function parseArgs(args) {
  const options = {
    browser: '',
    suite: '',
  };

  for (const arg of args) {
    if (arg.startsWith('--browser=')) {
      options.browser = normalizeBrowser(arg.split('=')[1]);
      continue;
    }

    if (!options.suite) {
      options.suite = arg.trim().toLowerCase();
    }
  }

  return options;
}

/**
 * Resolve report paths for the requested suite/browser combination.
 * @param {string} suite
 * @param {string} browser
 * @returns {{ inputDir: string, htmlPath: string, mergedPath: string, zephyrJsonPath: string }}
 */
function resolveReportPaths(suite, browser) {
  switch (suite) {
    case 'functional':
      return {
        inputDir: path.join('functional-output', 'prod', browser, 'cucumber'),
        mergedPath: path.join('functional-output', 'prod', browser, 'cucumber', `${browser}-report.ndjson`),
        htmlPath: path.join('functional-output', 'prod', browser, 'cucumber', `${browser}-report.html`),
        zephyrJsonPath: path.join('functional-output', 'zephyr', 'cucumber-report.json'),
      };
    case 'legacy':
      return {
        inputDir: path.join('functional-output', 'prod', browser, 'legacy', 'cucumber'),
        mergedPath: path.join('functional-output', 'prod', browser, 'legacy', 'cucumber', 'legacy-report.ndjson'),
        htmlPath: path.join('functional-output', 'prod', browser, 'legacy', 'cucumber', 'legacy-report.html'),
        zephyrJsonPath: path.join('functional-output', 'zephyr', 'cucumber-report.json'),
      };
    case 'smoke':
      return {
        inputDir: path.join('smoke-output', 'prod', browser, 'cucumber'),
        mergedPath: path.join('smoke-output', 'prod', browser, 'cucumber', 'smoke-report.ndjson'),
        htmlPath: path.join('smoke-output', 'prod', browser, 'cucumber', 'smoke-report.html'),
        zephyrJsonPath: path.join('smoke-output', 'zephyr', 'cucumber-report.json'),
      };
    default:
      throw new Error(`Unsupported Cucumber report suite: ${suite || '(empty)'}`);
  }
}

/**
 * Load and parse source ndjson files while excluding stale merged outputs.
 * @param {string} inputDir
 * @param {string} mergedPath
 * @returns {{ messages: object[], sourceFiles: string[] }}
 */
function loadMessages(inputDir, mergedPath) {
  if (!fs.existsSync(inputDir)) {
    throw new Error(`Cucumber report input directory does not exist: ${inputDir}`);
  }

  const mergedFilename = path.basename(mergedPath);
  const sourceFiles = fs
    .readdirSync(inputDir)
    .filter((filename) => filename.endsWith('.ndjson'))
    .filter((filename) => filename !== mergedFilename)
    .map((filename) => path.join(inputDir, filename))
    .sort();

  if (sourceFiles.length === 0) {
    throw new Error(`No source ndjson files found in ${inputDir}`);
  }

  const messageCollections = sourceFiles
    .map((filePath) => {
      const content = fs.readFileSync(filePath, 'utf8').trim();

      if (!content) {
        return [];
      }

      return content.split('\n').map((line, index) => {
        try {
          return JSON.parse(line);
        } catch (error) {
          throw new Error(`Invalid ndjson in ${filePath} at line ${index + 1}: ${error.message}`);
        }
      });
    })
    .filter((collection) => collection.length > 0);

  if (messageCollections.length === 0) {
    throw new Error(`All ndjson inputs in ${inputDir} were empty`);
  }

  return {
    messages: mergeMessages(messageCollections),
    sourceFiles,
  };
}

/**
 * Write merged ndjson to disk.
 * @param {string} outputPath
 * @param {object[]} messages
 */
function writeMergedNdjson(outputPath, messages) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const output = messages.map((message) => JSON.stringify(message)).join('\n');
  fs.writeFileSync(outputPath, output);
}

/**
 * Write Cucumber JSON output for Zephyr integration.
 * @param {string} outputPath
 * @param {object[]} messages
 */
function writeZephyrJson(outputPath, messages) {
  let jsonOutput = '';
  const eventBroadcaster = createJsonFormatter(messages, (chunk) => {
    jsonOutput = chunk;
  });

  for (const message of messages) {
    eventBroadcaster.emit('envelope', message);
  }

  if (!jsonOutput) {
    throw new Error('Failed to generate cucumber JSON output');
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, jsonOutput);
}

/**
 * Write the standalone HTML report.
 * @param {string} outputPath
 * @param {object[]} messages
 * @returns {Promise<void>}
 */
async function writeHtmlReport(outputPath, messages) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  await pipeline(
    Readable.from(messages, { objectMode: true }),
    createHtmlStream(),
    fs.createWriteStream(outputPath),
  );
}

async function main() {
  const { suite, browser: requestedBrowser } = parseArgs(process.argv.slice(2));

  if (!suite) {
    throw new Error('A report suite must be provided: smoke, functional, or legacy');
  }

  const browser = requestedBrowser || resolveGenericBrowser(process.env.BROWSER_TO_RUN);
  const reportPaths = resolveReportPaths(suite, browser);
  const { messages, sourceFiles } = loadMessages(reportPaths.inputDir, reportPaths.mergedPath);

  console.log(`[build-cucumber-report] suite=${suite}`);
  console.log(`[build-cucumber-report] browser=${browser}`);
  console.log(`[build-cucumber-report] inputs=${sourceFiles.length}`);

  writeMergedNdjson(reportPaths.mergedPath, messages);
  writeZephyrJson(reportPaths.zephyrJsonPath, messages);
  await writeHtmlReport(reportPaths.htmlPath, messages);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
