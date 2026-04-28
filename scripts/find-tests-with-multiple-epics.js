#!/usr/bin/env node

/**
 * Find executable Cypress tests that have more than one `@JIRA-EPIC:*` tag.
 *
 * Example usage:
 *   node scripts/find-tests-with-multiple-epics.js
 */

const { collectExecutableTests } = require('./check-cypress-test-metadata.js');

const EPIC_TAG_RE = /^@JIRA-EPIC:/;

function main() {
  const { allTests } = collectExecutableTests();
  const offenders = allTests
    .map((test) => ({
      ...test,
      epicTags: test.tags.filter((tag) => EPIC_TAG_RE.test(tag)),
    }))
    .filter((test) => test.epicTags.length > 1)
    .sort((a, b) => {
      return a.file.localeCompare(b.file) || a.line - b.line || a.qualifiedTitle.localeCompare(b.qualifiedTitle);
    });

  if (offenders.length === 0) {
    console.log('No executable Cypress tests have multiple JIRA epic tags.');
    process.exit(0);
  }

  console.log(`Found ${offenders.length} executable Cypress test(s) with multiple JIRA epic tags:\n`);

  for (const test of offenders) {
    console.log(`${test.scope} ${test.file}:${test.line}`);
    console.log(`  ${test.qualifiedTitle}`);
    console.log(`  ${test.epicTags.join(' | ')}`);
    console.log('');
  }

  process.exit(1);
}

main();
