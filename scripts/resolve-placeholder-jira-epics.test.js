const test = require('node:test');
const assert = require('node:assert/strict');

const {
  PLACEHOLDER_EPIC_TAG,
  classifyPlaceholderEpicTests,
  buildAuthHeader,
  extractEpicKeyFromIssue,
  resolveStoryEpic,
  replaceComponentPlaceholder,
  replaceFunctionalPlaceholder,
  buildReport,
} = require('./resolve-placeholder-jira-epics.js');

function makeTest(overrides = {}) {
  return {
    scope: 'component',
    file: 'cypress/component/example.cy.ts',
    line: 10,
    title: 'example',
    qualifiedTitle: 'suite > example',
    tags: [PLACEHOLDER_EPIC_TAG, '@JIRA-STORY:PO-123'],
    ...overrides,
  };
}

test('classifyPlaceholderEpicTests separates eligible and skipped tests', () => {
  const eligible = makeTest({ line: 1 });
  const noStory = makeTest({ line: 2, tags: [PLACEHOLDER_EPIC_TAG, '@JIRA-DEFECT:PO-999'] });
  const multipleStories = makeTest({
    line: 3,
    tags: [PLACEHOLDER_EPIC_TAG, '@JIRA-STORY:PO-123', '@JIRA-STORY:PO-456'],
  });

  const result = classifyPlaceholderEpicTests([eligible, noStory, multipleStories]);

  assert.equal(result.eligible.length, 1);
  assert.equal(result.eligible[0].storyKey, 'PO-123');
  assert.equal(result.skippedNoStory.length, 1);
  assert.equal(result.skippedNoStory[0].reason, 'no_story_tag');
  assert.equal(result.skippedMultipleStories.length, 1);
  assert.equal(result.skippedMultipleStories[0].reason, 'multiple_story_tags');
});

test('buildAuthHeader passes through preformatted tokens and prefixes raw tokens', () => {
  assert.equal(buildAuthHeader('Bearer abc123'), 'Bearer abc123');
  assert.equal(buildAuthHeader('Basic abc123'), 'Basic abc123');
  assert.equal(buildAuthHeader('abc123'), 'Bearer abc123');
});

test('extractEpicKeyFromIssue prefers the configured epic link field', () => {
  const issue = {
    fields: {
      customfield_10008: 'PO-999',
      parent: {
        key: 'PO-111',
        fields: { issuetype: { name: 'Epic' } },
      },
    },
  };

  assert.deepEqual(extractEpicKeyFromIssue(issue), {
    epicKey: 'PO-999',
    source: 'epic_link_field',
  });
});

test('extractEpicKeyFromIssue falls back to an epic parent', () => {
  const issue = {
    fields: {
      customfield_10008: null,
      parent: {
        key: 'PO-222',
        fields: { issuetype: { name: 'Epic' } },
      },
    },
  };

  assert.deepEqual(extractEpicKeyFromIssue(issue), {
    epicKey: 'PO-222',
    source: 'epic_parent',
  });
});

test('resolveStoryEpic reports unresolved stories when no epic is present', async () => {
  const result = await resolveStoryEpic('PO-123', async () => ({
    fields: {
      customfield_10008: null,
    },
  }));

  assert.equal(result.epicKey, null);
  assert.equal(result.reason, 'missing_epic_field');
});

test('replaceComponentPlaceholder rewrites only the placeholder token in an inline array', () => {
  const sourceText = `it('works', { tags: ['@JIRA-STORY:PO-123', '${PLACEHOLDER_EPIC_TAG}', '@JIRA-KEY:POT-1'] }, () => {});`;
  const start = sourceText.indexOf('[');
  const end = sourceText.indexOf(']') + 1;
  const testCase = makeTest({
    tagEdit: {
      kind: 'component_inline_array',
      start,
      end,
    },
  });

  const result = replaceComponentPlaceholder(sourceText, testCase, '@JIRA-EPIC:PO-321');

  assert.equal(result.didWrite, true);
  assert.match(result.nextSourceText, /@JIRA-EPIC:PO-321/);
  assert.doesNotMatch(result.nextSourceText, /@JIRA-EPIC:PO-0000/);
});

test('replaceFunctionalPlaceholder rewrites the placeholder token in the target scenario block', () => {
  const lines = ['@JIRA-STORY:PO-123 @JIRA-EPIC:PO-0000', 'Scenario: works', '  Given something'];
  const testCase = makeTest({
    scope: 'functional',
    file: 'cypress/e2e/functional/opal/example.feature',
    tagEdit: {
      kind: 'functional_gherkin_block',
      anchorLine: 1,
    },
  });

  const result = replaceFunctionalPlaceholder(lines, testCase, '@JIRA-EPIC:PO-321');

  assert.equal(result.didWrite, true);
  assert.equal(result.nextLines[0], '@JIRA-STORY:PO-123 @JIRA-EPIC:PO-321');
});

test('replaceFunctionalPlaceholder rewrites the placeholder token above the scenario anchor', () => {
  const lines = ['@feature-tag', '@JIRA-STORY:PO-123 @JIRA-EPIC:PO-0000', 'Scenario: works', '  Given something'];
  const testCase = makeTest({
    scope: 'functional',
    file: 'cypress/e2e/functional/opal/example.feature',
    tagEdit: {
      kind: 'functional_gherkin_block',
      anchorLine: 3,
    },
  });

  const result = replaceFunctionalPlaceholder(lines, testCase, '@JIRA-EPIC:PO-321');

  assert.equal(result.didWrite, true);
  assert.equal(result.nextLines[1], '@JIRA-STORY:PO-123 @JIRA-EPIC:PO-321');
});

test('buildReport summarises replacement activity', () => {
  const placeholderTest = makeTest();
  const summary = {
    placeholderTests: [placeholderTest],
    classification: {
      eligible: [{ test: placeholderTest, storyKey: 'PO-123', storyTag: '@JIRA-STORY:PO-123' }],
      skippedNoStory: [],
      skippedMultipleStories: [],
    },
    resolution: {
      cache: new Map([['PO-123', { epicKey: 'PO-321' }]]),
      resolved: [],
      unresolved: [],
      jiraErrors: [],
    },
    writeResult: {
      replacements: [],
      skipped: [],
    },
    remainingPlaceholderTests: [],
  };

  const report = buildReport(summary);

  assert.equal(report.counts.placeholderTests, 1);
  assert.equal(report.counts.eligible, 1);
  assert.equal(report.counts.remainingPlaceholderTests, 0);
});
