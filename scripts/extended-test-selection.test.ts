import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

test('pipeline entry points allow only labelled PRs to opt in and always include extended tests in nightly', () => {
  const cnp = readFileSync(new URL('../Jenkinsfile_CNP', import.meta.url), 'utf8');
  const nightly = readFileSync(new URL('../Jenkinsfile_nightly', import.meta.url), 'utf8');
  assert.match(cnp, /boolean extendedTestsEnabled = isPR && cachedPrLabels\.contains\('extendedTests'\)/);
  assert.match(
    cnp,
    /env\.EXCLUDE_EXTENDED_TESTS = extendedTestsEnabled \? stringFalse : stringTrue[\s\S]*withPipeline\(/,
  );
  assert.match(nightly, /env\.EXCLUDE_EXTENDED_TESTS = 'false'[\s\S]*withNightlyPipeline\(/);
});

test('direct Cypress config does not interpret the pipeline extended-test exclusion flag', () => {
  const config = readFileSync(new URL('../cypress.config.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(config, /EXCLUDE_EXTENDED_TESTS|__opalExcludeExtendedTests/);
});
