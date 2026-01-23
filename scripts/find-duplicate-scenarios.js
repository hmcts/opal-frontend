#!/usr/bin/env node

/**
 * Find duplicate Cucumber scenario names across .feature files.
 * - Detects Scenario: and Scenario Outline:
 * - Ignores commented lines
 * - Prints duplicates with file:line for each occurrence
 *
 * Usage:
 *   node scripts/find-duplicate-scenarios.js
 *
 * Optional (override scan path):
 *   FEATURE_GLOB="cypress/e2e/<recursive>/*.feature" node scripts/find-duplicate-scenarios.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.env.FEATURE_GLOB ? process.env.FEATURE_GLOB.replace(/\/\*\*\/\*\.feature$/, '') : 'cypress/e2e';

const scenarioRegex = /^\s*Scenario(?:\s+Outline)?:\s*(.+)$/;

const occurrences = new Map();

/**
 * Recursively walk a directory to find .feature files.
 * @param {string} dir - Directory to scan.
 * @returns {void}
 */
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    if (entry.isFile() && full.endsWith('.feature')) processFile(full);
  }
}

/**
 * Parse a single .feature file and record scenario names with their locations.
 * @param {string} file - Path to the feature file.
 * @returns {void}
 */
function processFile(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, idx) => {
    if (line.trim().startsWith('#')) return;
    const match = line.match(scenarioRegex);
    if (!match) return;

    const name = match[1].trim().replace(/\s+/g, ' ');
    if (!occurrences.has(name)) occurrences.set(name, []);
    occurrences.get(name).push(`${file}:${idx + 1}`);
  });
}

walk(ROOT);

const duplicates = [...occurrences.entries()].filter(([, locs]) => locs.length > 1);

if (duplicates.length === 0) {
  console.log('No duplicate scenario names found.');
  process.exit(0);
}

console.log(`Found ${duplicates.length} duplicate scenario name(s):\n`);
for (const [name, locs] of duplicates) {
  console.log(`"${name}"`);
  locs.forEach((l) => console.log(`  - ${l}`));
  console.log('');
}

process.exit(1);
