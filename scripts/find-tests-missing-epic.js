#!/usr/bin/env node

/**
 * Find executable Cypress tests that do not have any `@JIRA-EPIC:*` tag.
 *
 * How it works:
 * - Reuses the executable-test extraction logic from `scripts/check-cypress-test-metadata.js`
 *   so it inspects real component `it(...)` tests and compiled functional Cucumber scenarios,
 *   rather than doing a plain text grep.
 * - Scans Cypress component spec files under `cypress/component/` and Opal functional
 *   feature files under `cypress/e2e/functional/opal/`.
 * - Reports every executable test that has zero `@JIRA-EPIC:*` tags.
 * - In read-only mode it prints the missing-epic list and exits with code `1` when any
 *   missing tests are found.
 * - In write mode it can add a placeholder epic tag where the script can do so safely:
 *   - feature files: appends the placeholder to the scenario tag block, or inserts a new
 *     tag line directly above the scenario when no tag block exists
 *   - component specs: appends the placeholder when the test uses an inline `tags: [...]`
 *     array in the Cypress config object
 * - If a component test uses a more complex tag shape, the script reports that test as
 *   skipped instead of guessing how to rewrite it.
 *
 * Arguments:
 * - `--write`
 *   Enables file edits. Without this flag, the script is report-only.
 * - `--placeholder=@JIRA-EPIC:PO-0000`
 *   Overrides the placeholder epic tag to insert during `--write`. The value must start
 *   with `@JIRA-EPIC:`.
 *
 * Example usage:
 *   node scripts/find-tests-missing-epic.js
 *   node scripts/find-tests-missing-epic.js --write --placeholder=@JIRA-EPIC:PO-0000
 */

const fs = require('fs');
const path = require('path');
const { ROOT, collectExecutableTests } = require('./check-cypress-test-metadata.js');

const EPIC_TAG_RE = /^@JIRA-EPIC:/;
const DEFAULT_PLACEHOLDER = '@JIRA-EPIC:PO-0000';

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    write: args.includes('--write'),
    placeholder:
      args
        .find((arg) => arg.startsWith('--placeholder='))
        ?.slice('--placeholder='.length)
        .trim() || DEFAULT_PLACEHOLDER,
  };
}

function formatTest(test) {
  return `${test.scope} ${test.file}:${test.line} ${test.qualifiedTitle}`;
}

function collectMissingEpicTests() {
  const { allTests } = collectExecutableTests();
  return allTests.filter((test) => !test.tags.some((tag) => EPIC_TAG_RE.test(tag)));
}

function uniqueWritableTargets(tests) {
  const seen = new Set();
  const unique = [];

  for (const test of tests) {
    const dedupeKey =
      test.scope === 'functional' && test.tagEdit?.kind === 'functional_gherkin_block'
        ? `${test.scope}:${test.file}:anchor:${test.tagEdit.anchorLine}`
        : `${test.scope}:${test.file}:${test.line}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    unique.push(test);
  }

  return unique;
}

function applyComponentPlaceholder(filePath, tests, placeholder) {
  let source = fs.readFileSync(filePath, 'utf8');
  const edits = [];
  const skipped = [];

  for (const test of tests) {
    if (!test.tagEdit || test.tagEdit.kind !== 'component_inline_array') {
      skipped.push({ test, reason: 'component test does not use an inline tags array' });
      continue;
    }

    const arrayText = source.slice(test.tagEdit.start, test.tagEdit.end);
    if (arrayText.includes(placeholder)) continue;

    const insertion = arrayText.trim() === '[]' ? `'${placeholder}'` : `, '${placeholder}'`;
    edits.push({
      start: test.tagEdit.end - 1,
      end: test.tagEdit.end - 1,
      text: insertion,
    });
  }

  edits.sort((a, b) => b.start - a.start);
  for (const edit of edits) {
    source = `${source.slice(0, edit.start)}${edit.text}${source.slice(edit.end)}`;
  }

  if (edits.length > 0) fs.writeFileSync(filePath, source, 'utf8');

  return { written: edits.length, skipped };
}

function applyFunctionalPlaceholder(filePath, tests, placeholder) {
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  let written = 0;
  const skipped = [];

  for (const test of [...tests].sort((a, b) => {
    const aAnchor = a.tagEdit?.kind === 'functional_gherkin_block' ? a.tagEdit.anchorLine : a.line;
    const bAnchor = b.tagEdit?.kind === 'functional_gherkin_block' ? b.tagEdit.anchorLine : b.line;
    return bAnchor - aAnchor;
  })) {
    if (!test.tagEdit || test.tagEdit.kind !== 'functional_gherkin_block') {
      skipped.push({ test, reason: 'functional test is missing a Gherkin anchor line' });
      continue;
    }

    const anchorIndex = test.tagEdit.anchorLine - 1;
    let tagLineIndex = anchorIndex - 1;

    while (tagLineIndex >= 0 && lines[tagLineIndex].trim().startsWith('@')) {
      tagLineIndex--;
    }

    const firstTagIndex = tagLineIndex + 1;
    const hasTagBlock = firstTagIndex < anchorIndex && lines[firstTagIndex].trim().startsWith('@');

    if (hasTagBlock) {
      const lastTagIndex = anchorIndex - 1;
      if (!lines[lastTagIndex].includes(placeholder)) {
        lines[lastTagIndex] = `${lines[lastTagIndex]} ${placeholder}`.trimEnd();
        written++;
      }
      continue;
    }

    lines.splice(anchorIndex, 0, placeholder);
    written++;
  }

  if (written > 0) fs.writeFileSync(filePath, `${lines.join('\n')}\n`, 'utf8');

  return { written, skipped };
}

function writePlaceholders(tests, placeholder) {
  const byFile = new Map();
  for (const test of uniqueWritableTargets(tests)) {
    const absolutePath = path.join(ROOT, test.file);
    if (!byFile.has(absolutePath)) byFile.set(absolutePath, []);
    byFile.get(absolutePath).push(test);
  }

  let written = 0;
  const skipped = [];

  for (const [filePath, fileTests] of byFile.entries()) {
    const componentTests = fileTests.filter((test) => test.scope === 'component');
    const functionalTests = fileTests.filter((test) => test.scope === 'functional');

    if (componentTests.length > 0) {
      const result = applyComponentPlaceholder(filePath, componentTests, placeholder);
      written += result.written;
      skipped.push(...result.skipped);
    }

    if (functionalTests.length > 0) {
      const result = applyFunctionalPlaceholder(filePath, functionalTests, placeholder);
      written += result.written;
      skipped.push(...result.skipped);
    }
  }

  return { written, skipped };
}

function printMissingTests(tests, heading) {
  console.log(`${heading}: ${tests.length}`);
  for (const test of tests) {
    console.log(`- ${formatTest(test)}`);
  }
}

function main() {
  const { write, placeholder } = parseArgs();

  if (!placeholder.startsWith('@JIRA-EPIC:')) {
    console.error(`Placeholder must start with @JIRA-EPIC:, received: ${placeholder}`);
    process.exit(2);
  }

  const before = collectMissingEpicTests();

  if (before.length === 0) {
    console.log('No executable Cypress tests are missing a JIRA epic tag.');
    process.exit(0);
  }

  printMissingTests(before, 'Tests missing a JIRA epic tag before write');

  if (!write) {
    process.exit(1);
  }

  const { written, skipped } = writePlaceholders(before, placeholder);
  const after = collectMissingEpicTests();

  console.log(`\nPlaceholder write summary: wrote ${written} placeholder tag insertion(s).`);

  if (skipped.length > 0) {
    console.log('\nSkipped write targets:');
    for (const { test, reason } of skipped) {
      console.log(`- ${formatTest(test)} (${reason})`);
    }
  }

  if (after.length === 0) {
    console.log('\nAll executable Cypress tests now have at least one JIRA epic tag.');
    process.exit(0);
  }

  console.log('');
  printMissingTests(after, 'Tests still missing a JIRA epic tag after write');
  process.exit(1);
}

main();
