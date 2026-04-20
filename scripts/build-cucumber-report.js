#!/usr/bin/env node
'use strict';

/**
 * @fileoverview Builds merged Cucumber ndjson, Zephyr JSON, and Jenkins HTML reports from raw Cypress outputs.
 * @description Used by smoke and functional report-combine steps for both OPAL and Legacy modes after parallel or
 * serial Cypress execution. This avoids brittle shell-based merge commands and keeps the generated HTML, merged
 * ndjson, and Zephyr JSON outputs aligned with the selected suite/browser/mode combination.
 */

const fs = require('node:fs');
const path = require('node:path');
const { Readable } = require('node:stream');
const { pipeline } = require('node:stream/promises');
const { resolveGenericBrowser, normalizeBrowser } = require('./browser-support');

const { mergeMessages } = require('../node_modules/@badeball/cypress-cucumber-preprocessor/dist/helpers/merge.js');
const {
  createHtmlStream,
  createJsonFormatter,
} = require('../node_modules/@badeball/cypress-cucumber-preprocessor/dist/helpers/formatters.js');

/**
 * Parse CLI arguments into a simple key-value object.
 * @param {string[]} args
 * @returns {{ suite: string, browser: string, mode: string }}
 */
function parseArgs(args) {
  const options = {
    browser: '',
    mode: '',
    suite: '',
  };

  for (const arg of args) {
    if (arg.startsWith('--browser=')) {
      options.browser = normalizeBrowser(arg.split('=')[1]);
      continue;
    }

    if (arg.startsWith('--mode=')) {
      options.mode = arg.split('=')[1].trim().toLowerCase();
      continue;
    }

    if (!options.suite) {
      options.suite = arg.trim().toLowerCase();
    }
  }

  if (options.suite === 'legacy') {
    options.suite = 'functional';
    options.mode = 'legacy';
  }

  if (!options.mode) {
    options.mode = 'opal';
  }

  return options;
}

/**
 * Resolve report paths for the requested suite/browser combination.
 * @param {string} suite
 * @param {string} browser
 * @param {string} mode
 * @returns {{ inputDir: string, htmlPath: string, mergedPath: string, zephyrJsonPath: string }}
 */
function resolveReportPaths(suite, browser, mode) {
  switch (`${suite}:${mode}`) {
    case 'functional:opal':
      return {
        inputDir: path.join('functional-output', 'prod', browser, 'cucumber'),
        mergedPath: path.join('functional-output', 'prod', browser, 'cucumber', `${browser}-report.ndjson`),
        htmlPath: path.join('functional-output', 'prod', browser, 'cucumber', `${browser}-report.html`),
        zephyrJsonPath: path.join('functional-output', 'zephyr', 'cucumber-report.json'),
      };
    case 'functional:legacy':
      return {
        inputDir: path.join('functional-output', 'prod', browser, 'legacy', 'cucumber'),
        mergedPath: path.join('functional-output', 'prod', browser, 'legacy', 'cucumber', 'legacy-report.ndjson'),
        htmlPath: path.join('functional-output', 'prod', browser, 'legacy', 'cucumber', 'legacy-report.html'),
        zephyrJsonPath: path.join('functional-output', 'zephyr', 'cucumber-report.json'),
      };
    case 'smoke:opal':
      return {
        inputDir: path.join('smoke-output', 'prod', browser, 'cucumber'),
        mergedPath: path.join('smoke-output', 'prod', browser, 'cucumber', 'smoke-report.ndjson'),
        htmlPath: path.join('smoke-output', 'prod', browser, 'cucumber', 'smoke-report.html'),
        zephyrJsonPath: path.join('smoke-output', 'zephyr', 'cucumber-report.json'),
      };
    case 'smoke:legacy':
      return {
        inputDir: path.join('smoke-output', 'prod', browser, 'legacy', 'cucumber'),
        mergedPath: path.join('smoke-output', 'prod', browser, 'legacy', 'cucumber', 'legacy-report.ndjson'),
        htmlPath: path.join('smoke-output', 'prod', browser, 'legacy', 'cucumber', 'legacy-report.html'),
        zephyrJsonPath: path.join('smoke-output', 'zephyr', 'cucumber-report.json'),
      };
    default:
      throw new Error(`Unsupported Cucumber report suite/mode: ${suite || '(empty)'}/${mode || '(empty)'}`);
  }
}

/**
 * Create a stable replacement for a colliding runtime Cucumber `testCaseStarted.id`.
 * These ids are only used to link runtime envelopes together, so remapping them is safe
 * as long as every `testCaseStartedId` reference in the same shard is updated as well.
 * @param {string} originalId
 * @param {string} sourceFile
 * @param {Set<string>} usedIds
 * @returns {string}
 */
function createRemappedTestCaseStartedId(originalId, sourceFile, usedIds) {
  const shardName = path.basename(sourceFile, path.extname(sourceFile)).replace(/[^a-zA-Z0-9_-]/g, '_');
  let suffix = 1;
  let candidate = `${originalId}__${shardName}`;

  while (usedIds.has(candidate)) {
    suffix += 1;
    candidate = `${originalId}__${shardName}_${suffix}`;
  }

  return candidate;
}

/**
 * Recursively rewrite any `testCaseStartedId` reference using the supplied remap table.
 * @param {unknown} value
 * @param {Map<string, string>} remappedIds
 * @returns {unknown}
 */
function remapTestCaseStartedReferences(value, remappedIds) {
  if (Array.isArray(value)) {
    let changed = false;
    const next = value.map((item) => {
      const remapped = remapTestCaseStartedReferences(item, remappedIds);
      if (remapped !== item) changed = true;
      return remapped;
    });

    return changed ? next : value;
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  let changed = false;
  const next = {};

  for (const [key, nestedValue] of Object.entries(value)) {
    let remappedValue = nestedValue;

    if (key === 'testCaseStartedId' && typeof nestedValue === 'string' && remappedIds.has(nestedValue)) {
      remappedValue = remappedIds.get(nestedValue);
    } else {
      remappedValue = remapTestCaseStartedReferences(nestedValue, remappedIds);
    }

    if (remappedValue !== nestedValue) {
      changed = true;
    }

    next[key] = remappedValue;
  }

  return changed ? next : value;
}

/**
 * Ensure runtime `testCaseStarted.id` values are unique across parallel shards.
 * Some parallel smoke shards can reuse the same runtime ids, which causes the
 * downstream Cucumber JSON formatter to merge unrelated scenarios together.
 * @param {object[][]} messageCollections
 * @param {string[]} sourceFiles
 * @returns {object[][]}
 */
function normalizeRuntimeMessageIds(messageCollections, sourceFiles) {
  const usedTestCaseStartedIds = new Set();

  return messageCollections.map((collection, index) => {
    const sourceFile = sourceFiles[index];
    const remappedIds = new Map();

    for (const message of collection) {
      const runtimeId = message.testCaseStarted?.id;

      if (!runtimeId) {
        continue;
      }

      if (usedTestCaseStartedIds.has(runtimeId)) {
        if (!remappedIds.has(runtimeId)) {
          const remappedId = createRemappedTestCaseStartedId(runtimeId, sourceFile, usedTestCaseStartedIds);
          remappedIds.set(runtimeId, remappedId);
          usedTestCaseStartedIds.add(remappedId);
        }

        continue;
      }

      usedTestCaseStartedIds.add(runtimeId);
    }

    if (remappedIds.size === 0) {
      return collection;
    }

    console.log(
      `[build-cucumber-report] remapped ${remappedIds.size} colliding testCaseStarted id(s) in ${path.basename(sourceFile)}`,
    );

    return collection.map((message) => {
      const remappedRuntimeId = message.testCaseStarted?.id && remappedIds.get(message.testCaseStarted.id);
      const messageWithRuntimeId =
        remappedRuntimeId == null
          ? message
          : {
              ...message,
              testCaseStarted: {
                ...message.testCaseStarted,
                id: remappedRuntimeId,
              },
            };

      return remapTestCaseStartedReferences(messageWithRuntimeId, remappedIds);
    });
  });
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

  const normalizedCollections = normalizeRuntimeMessageIds(messageCollections, sourceFiles);

  return {
    messages: mergeMessages(normalizedCollections),
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

  await pipeline(Readable.from(messages, { objectMode: true }), createHtmlStream(), fs.createWriteStream(outputPath));
}

async function main() {
  const { suite, browser: requestedBrowser, mode } = parseArgs(process.argv.slice(2));

  if (!suite) {
    throw new Error('A report suite must be provided: smoke or functional');
  }

  const browser = requestedBrowser || resolveGenericBrowser(process.env.BROWSER_TO_RUN);
  const reportPaths = resolveReportPaths(suite, browser, mode);
  const { messages, sourceFiles } = loadMessages(reportPaths.inputDir, reportPaths.mergedPath);

  console.log(`[build-cucumber-report] suite=${suite}`);
  console.log(`[build-cucumber-report] mode=${mode}`);
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
