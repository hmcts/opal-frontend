#!/usr/bin/env node

/**
 * Resolve placeholder Jira epic tags on executable Cypress tests.
 *
 * This script finds executable tests that carry the exact placeholder tag
 * `@JIRA-EPIC:PO-0000`, reads the single `@JIRA-STORY:*` tag on the same test,
 * resolves the story's epic from Jira, and replaces only the placeholder token.
 *
 * Safety rules:
 * - tests with zero story tags are skipped
 * - tests with multiple story tags are skipped
 * - tests whose placeholder cannot be rewritten safely are skipped
 * - tests whose Jira story does not resolve to an epic are skipped
 *
 * Usage:
 *   node scripts/resolve-placeholder-jira-epics.js
 *   node scripts/resolve-placeholder-jira-epics.js --write
 *   node scripts/resolve-placeholder-jira-epics.js --write --output=tmp/my-report.json
 */

const fs = require('fs');
const path = require('path');
const { ROOT, collectExecutableTests } = require('./check-cypress-test-metadata.js');

const PLACEHOLDER_EPIC_TAG = '@JIRA-EPIC:PO-0000';
const EPIC_TAG_RE = /^@JIRA-EPIC:/;
const STORY_TAG_RE = /^@JIRA-STORY:/;
const DEFAULT_OUTPUT = path.join(ROOT, 'tmp', 'placeholder-epic-resolution-report.json');
const JIRA_BASE_URL = 'https://tools.hmcts.net/jira/rest/api/latest';
const JIRA_EPIC_LINK_FIELD_ID = 'customfield_10008';

function parseArgs(argv = process.argv.slice(2)) {
  const outputArg = argv.find((arg) => arg.startsWith('--output='));
  const outputValue = outputArg?.slice('--output='.length).trim();

  return {
    write: argv.includes('--write'),
    outputPath: outputValue
      ? path.isAbsolute(outputValue)
        ? outputValue
        : path.join(ROOT, outputValue)
      : DEFAULT_OUTPUT,
  };
}

function formatTest(test) {
  return `${test.scope} ${test.file}:${test.line} ${test.qualifiedTitle}`;
}

function getStoryTags(test) {
  return test.tags.filter((tag) => STORY_TAG_RE.test(tag));
}

function collectPlaceholderEpicTests() {
  const { allTests } = collectExecutableTests();
  return allTests.filter((test) => test.tags.includes(PLACEHOLDER_EPIC_TAG));
}

function classifyPlaceholderEpicTests(tests) {
  const eligible = [];
  const skippedNoStory = [];
  const skippedMultipleStories = [];

  for (const test of tests) {
    const storyTags = getStoryTags(test);

    if (storyTags.length === 0) {
      skippedNoStory.push({ test, reason: 'no_story_tag', storyTags: [] });
      continue;
    }

    if (storyTags.length > 1) {
      skippedMultipleStories.push({ test, reason: 'multiple_story_tags', storyTags });
      continue;
    }

    eligible.push({
      test,
      storyTag: storyTags[0],
      storyKey: storyTags[0].replace('@JIRA-STORY:', ''),
    });
  }

  return { eligible, skippedNoStory, skippedMultipleStories };
}

function buildAuthHeader(token) {
  const trimmed = String(token || '').trim();
  if (!trimmed) {
    throw new Error('JIRA_AUTH_TOKEN environment variable is required to resolve placeholder Jira epics');
  }

  if (/^(Basic|Bearer)\s+/i.test(trimmed)) return trimmed;
  return `Bearer ${trimmed}`;
}

function extractEpicKeyFromIssue(issue) {
  const fields = issue?.fields || {};
  const epicLink = fields[JIRA_EPIC_LINK_FIELD_ID];

  if (typeof epicLink === 'string' && epicLink.trim()) {
    return {
      epicKey: epicLink.trim(),
      source: 'epic_link_field',
    };
  }

  const parentKey = typeof fields.parent?.key === 'string' ? fields.parent.key.trim() : '';
  const parentIssueType = fields.parent?.fields?.issuetype?.name || fields.parent?.issuetype?.name;

  if (parentKey && typeof parentIssueType === 'string' && parentIssueType.trim().toLowerCase() === 'epic') {
    return {
      epicKey: parentKey,
      source: 'epic_parent',
    };
  }

  return {
    epicKey: null,
    source: parentKey ? 'parent_not_epic' : 'missing_epic_field',
  };
}

async function fetchJiraIssue(storyKey, { fetchImpl = globalThis.fetch, token } = {}) {
  if (typeof fetchImpl !== 'function') {
    throw new Error('Global fetch is not available in this Node runtime');
  }

  const response = await fetchImpl(
    `${JIRA_BASE_URL}/issue/${encodeURIComponent(storyKey)}?fields=${encodeURIComponent(
      `${JIRA_EPIC_LINK_FIELD_ID},parent,issuetype`,
    )}`,
    {
      headers: {
        Accept: 'application/json',
        Authorization: buildAuthHeader(token),
      },
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const bodyText = typeof response.text === 'function' ? await response.text() : '';
    const suffix = bodyText ? ` ${bodyText.slice(0, 200)}` : '';
    throw new Error(`Jira issue lookup failed for ${storyKey}: HTTP ${response.status}.${suffix}`.trim());
  }

  return response.json();
}

async function resolveStoryEpic(storyKey, jiraClient) {
  try {
    const issue = await jiraClient(storyKey);

    if (!issue) {
      return {
        storyKey,
        epicKey: null,
        reason: 'story_not_found',
      };
    }

    const extracted = extractEpicKeyFromIssue(issue);
    if (!extracted.epicKey) {
      return {
        storyKey,
        epicKey: null,
        reason: extracted.source,
      };
    }

    return {
      storyKey,
      epicKey: extracted.epicKey,
      source: extracted.source,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      storyKey,
      epicKey: null,
      reason: 'jira_error',
      error: message,
    };
  }
}

async function resolveEligibleTests(eligible, options) {
  const cache = new Map();
  const resolved = [];
  const unresolved = [];
  const jiraErrors = [];

  for (const item of eligible) {
    let resolution = cache.get(item.storyKey);
    if (!resolution) {
      resolution = await resolveStoryEpic(item.storyKey, (storyKey) => fetchJiraIssue(storyKey, options));
      cache.set(item.storyKey, resolution);
    }

    if (resolution.reason === 'jira_error') {
      jiraErrors.push({ ...item, resolution });
      continue;
    }

    if (!resolution.epicKey) {
      unresolved.push({ ...item, resolution });
      continue;
    }

    resolved.push({
      ...item,
      resolvedEpicKey: resolution.epicKey,
      resolvedEpicTag: `@JIRA-EPIC:${resolution.epicKey}`,
      resolutionSource: resolution.source,
    });
  }

  return {
    cache,
    resolved,
    unresolved,
    jiraErrors,
  };
}

function uniqueWritableTargets(tests) {
  const seen = new Set();
  const unique = [];

  for (const item of tests) {
    const test = item.test || item;
    const dedupeKey =
      test.scope === 'functional' && test.tagEdit?.kind === 'functional_gherkin_block'
        ? `${test.scope}:${test.file}:anchor:${test.tagEdit.anchorLine}`
        : `${test.scope}:${test.file}:${test.line}`;

    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    unique.push(item);
  }

  return unique;
}

function replaceComponentPlaceholder(sourceText, test, resolvedEpicTag) {
  if (!test.tagEdit || test.tagEdit.kind !== 'component_inline_array') {
    return {
      didWrite: false,
      reason: 'component_test_does_not_use_inline_tags_array',
      nextSourceText: sourceText,
    };
  }

  const arrayText = sourceText.slice(test.tagEdit.start, test.tagEdit.end);
  if (!arrayText.includes(PLACEHOLDER_EPIC_TAG)) {
    return {
      didWrite: false,
      reason: 'placeholder_not_present_in_inline_tags_array',
      nextSourceText: sourceText,
    };
  }

  const updatedArrayText = arrayText.replace(PLACEHOLDER_EPIC_TAG, resolvedEpicTag);
  return {
    didWrite: updatedArrayText !== arrayText,
    nextSourceText: `${sourceText.slice(0, test.tagEdit.start)}${updatedArrayText}${sourceText.slice(test.tagEdit.end)}`,
  };
}

function replaceFunctionalPlaceholder(lines, test, resolvedEpicTag) {
  if (!test.tagEdit || test.tagEdit.kind !== 'functional_gherkin_block') {
    return {
      didWrite: false,
      reason: 'functional_test_is_missing_gherkin_anchor_line',
      nextLines: lines,
    };
  }

  const nextLines = [...lines];
  const anchorIndex = test.tagEdit.anchorLine - 1;
  let firstTagIndex = anchorIndex;
  let hasTagBlock = nextLines[anchorIndex]?.trim().startsWith('@') || false;

  if (!hasTagBlock) {
    let tagLineIndex = anchorIndex - 1;
    while (tagLineIndex >= 0 && nextLines[tagLineIndex].trim().startsWith('@')) {
      tagLineIndex--;
    }

    firstTagIndex = tagLineIndex + 1;
    hasTagBlock = firstTagIndex < anchorIndex && nextLines[firstTagIndex].trim().startsWith('@');
  }

  if (!hasTagBlock) {
    return {
      didWrite: false,
      reason: 'functional_test_has_no_writable_tag_block',
      nextLines,
    };
  }

  let endTagIndex = firstTagIndex;
  while (endTagIndex < nextLines.length && nextLines[endTagIndex].trim().startsWith('@')) {
    endTagIndex++;
  }

  for (let index = firstTagIndex; index < endTagIndex; index++) {
    if (!nextLines[index].includes(PLACEHOLDER_EPIC_TAG)) continue;

    nextLines[index] = nextLines[index].replace(PLACEHOLDER_EPIC_TAG, resolvedEpicTag);
    return {
      didWrite: true,
      nextLines,
    };
  }

  return {
    didWrite: false,
    reason: 'placeholder_not_present_in_target_tag_block',
    nextLines,
  };
}

function writeResolvedEpics(resolvedTests) {
  const byFile = new Map();
  const replacements = [];
  const skipped = [];

  for (const item of uniqueWritableTargets(resolvedTests)) {
    const absolutePath = path.join(ROOT, item.test.file);
    if (!byFile.has(absolutePath)) byFile.set(absolutePath, []);
    byFile.get(absolutePath).push(item);
  }

  for (const [filePath, fileItems] of byFile.entries()) {
    const componentItems = fileItems.filter((item) => item.test.scope === 'component');
    const functionalItems = fileItems.filter((item) => item.test.scope === 'functional');

    if (componentItems.length > 0) {
      let sourceText = fs.readFileSync(filePath, 'utf8');
      let fileChanged = false;

      for (const item of [...componentItems].sort((a, b) => b.test.tagEdit.start - a.test.tagEdit.start)) {
        const result = replaceComponentPlaceholder(sourceText, item.test, item.resolvedEpicTag);
        if (!result.didWrite) {
          skipped.push({ ...item, reason: result.reason });
          continue;
        }

        sourceText = result.nextSourceText;
        fileChanged = true;
        replacements.push(item);
      }

      if (fileChanged) fs.writeFileSync(filePath, sourceText, 'utf8');
    }

    if (functionalItems.length > 0) {
      let lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
      let fileChanged = false;

      for (const item of [...functionalItems].sort((a, b) => {
        const aAnchor = a.test.tagEdit?.kind === 'functional_gherkin_block' ? a.test.tagEdit.anchorLine : a.test.line;
        const bAnchor = b.test.tagEdit?.kind === 'functional_gherkin_block' ? b.test.tagEdit.anchorLine : b.test.line;
        return bAnchor - aAnchor;
      })) {
        const result = replaceFunctionalPlaceholder(lines, item.test, item.resolvedEpicTag);
        if (!result.didWrite) {
          skipped.push({ ...item, reason: result.reason });
          continue;
        }

        lines = result.nextLines;
        fileChanged = true;
        replacements.push(item);
      }

      if (fileChanged) {
        const output = lines.join('\n');
        fs.writeFileSync(filePath, output.endsWith('\n') ? output : `${output}\n`, 'utf8');
      }
    }
  }

  return { replacements, skipped };
}

function buildReport(summary) {
  const resolutionCounts = getResolutionCounts(summary.resolution);

  return {
    generatedAt: new Date().toISOString(),
    placeholderEpicTag: PLACEHOLDER_EPIC_TAG,
    counts: {
      placeholderTests: summary.placeholderTests.length,
      eligible: summary.classification.eligible.length,
      skippedNoStory: summary.classification.skippedNoStory.length,
      skippedMultipleStories: summary.classification.skippedMultipleStories.length,
      resolvedStories: resolutionCounts.resolvedStories,
      resolvedTests: summary.resolution?.resolved?.length || 0,
      unresolvedStories: resolutionCounts.unresolvedStories,
      unresolvedTests: summary.resolution?.unresolved?.length || 0,
      jiraErrorStories: resolutionCounts.jiraErrorStories,
      jiraErrors: summary.resolution?.jiraErrors?.length || 0,
      replacementsWritten: summary.writeResult?.replacements?.length || 0,
      skippedUnwritableShape: summary.writeResult?.skipped?.length || 0,
      remainingPlaceholderTests: summary.remainingPlaceholderTests?.length || 0,
    },
    skippedNoStory: summary.classification.skippedNoStory.map((item) => serializeSkip(item)),
    skippedMultipleStories: summary.classification.skippedMultipleStories.map((item) => serializeSkip(item)),
    unresolvedStories: (summary.resolution?.unresolved || []).map((item) => serializeResolution(item)),
    jiraErrors: (summary.resolution?.jiraErrors || []).map((item) => serializeResolution(item)),
    replacementsWritten: (summary.writeResult?.replacements || []).map((item) => serializeResolution(item)),
    skippedUnwritableShape: (summary.writeResult?.skipped || []).map((item) => serializeResolution(item)),
  };
}

function serializeSkip(item) {
  return {
    reason: item.reason,
    scope: item.test.scope,
    file: item.test.file,
    line: item.test.line,
    qualifiedTitle: item.test.qualifiedTitle,
    storyTags: item.storyTags || getStoryTags(item.test),
  };
}

function serializeResolution(item) {
  return {
    reason: item.reason || item.resolution?.reason || null,
    scope: item.test.scope,
    file: item.test.file,
    line: item.test.line,
    qualifiedTitle: item.test.qualifiedTitle,
    storyKey: item.storyKey,
    storyTag: item.storyTag,
    resolvedEpicKey: item.resolvedEpicKey || item.resolution?.epicKey || null,
    resolvedEpicTag: item.resolvedEpicTag || null,
    resolutionSource: item.resolutionSource || item.resolution?.source || null,
    error: item.resolution?.error || null,
  };
}

function writeReport(outputPath, report) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
}

function getResolutionCounts(resolution) {
  const values = resolution?.cache ? [...resolution.cache.values()] : [];
  let resolvedStories = 0;
  let unresolvedStories = 0;
  let jiraErrorStories = 0;

  for (const item of values) {
    if (item?.reason === 'jira_error') {
      jiraErrorStories++;
      continue;
    }

    if (item?.epicKey) {
      resolvedStories++;
      continue;
    }

    unresolvedStories++;
  }

  return { resolvedStories, unresolvedStories, jiraErrorStories };
}

function printSummary(summary, outputPath) {
  const resolutionCounts = getResolutionCounts(summary.resolution);

  console.log(`Placeholder epic tests found: ${summary.placeholderTests.length}`);
  console.log(`Eligible for Jira resolution: ${summary.classification.eligible.length}`);
  console.log(`Skipped (multiple story tags): ${summary.classification.skippedMultipleStories.length}`);
  console.log(`Skipped (no story tag): ${summary.classification.skippedNoStory.length}`);

  if (!summary.resolutionAttempted) {
    console.log('Jira resolution skipped: JIRA_AUTH_TOKEN is not set.');
  } else {
    console.log(`Jira stories resolved: ${resolutionCounts.resolvedStories}`);
    console.log(`Skipped (unresolved story epic): ${summary.resolution.unresolved.length}`);
    console.log(`Jira lookup error stories: ${resolutionCounts.jiraErrorStories}`);
  }

  if (summary.writeMode) {
    console.log(`Placeholder epic replacements written: ${summary.writeResult.replacements.length}`);
    console.log(`Skipped (unwritable shape): ${summary.writeResult.skipped.length}`);
    console.log(`Remaining placeholder epic tests: ${summary.remainingPlaceholderTests.length}`);
  }

  console.log(`Report: ${path.relative(ROOT, outputPath)}`);
}

async function main() {
  const { write, outputPath } = parseArgs();
  const placeholderTests = collectPlaceholderEpicTests();
  const classification = classifyPlaceholderEpicTests(placeholderTests);
  const token = process.env['JIRA_AUTH_TOKEN'];
  const resolutionAttempted = Boolean(token);

  if (placeholderTests.length === 0) {
    const summary = {
      writeMode: write,
      resolutionAttempted,
      placeholderTests,
      classification,
      remainingPlaceholderTests: [],
      writeResult: { replacements: [], skipped: [] },
      resolution: { cache: new Map(), resolved: [], unresolved: [], jiraErrors: [] },
    };
    writeReport(outputPath, buildReport(summary));
    printSummary(summary, outputPath);
    process.exit(0);
  }

  if (!resolutionAttempted && write) {
    console.error('JIRA_AUTH_TOKEN environment variable is required when using --write.');
    process.exit(2);
  }

  const resolution = resolutionAttempted
    ? await resolveEligibleTests(classification.eligible, { token })
    : { cache: new Map(), resolved: [], unresolved: [], jiraErrors: [] };

  if (resolution.jiraErrors.length > 0) {
    const summary = {
      writeMode: write,
      resolutionAttempted,
      placeholderTests,
      classification,
      resolution,
      remainingPlaceholderTests: placeholderTests,
      writeResult: { replacements: [], skipped: [] },
    };
    writeReport(outputPath, buildReport(summary));
    printSummary(summary, outputPath);
    process.exit(2);
  }

  const writeResult =
    write && resolutionAttempted ? writeResolvedEpics(resolution.resolved) : { replacements: [], skipped: [] };

  const remainingPlaceholderTests = write ? collectPlaceholderEpicTests() : placeholderTests;
  const summary = {
    writeMode: write,
    resolutionAttempted,
    placeholderTests,
    classification,
    resolution,
    writeResult,
    remainingPlaceholderTests,
  };

  writeReport(outputPath, buildReport(summary));
  printSummary(summary, outputPath);

  if (!write) {
    process.exit(1);
  }

  process.exit(remainingPlaceholderTests.length === 0 ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = {
  PLACEHOLDER_EPIC_TAG,
  JIRA_EPIC_LINK_FIELD_ID,
  parseArgs,
  formatTest,
  getStoryTags,
  collectPlaceholderEpicTests,
  classifyPlaceholderEpicTests,
  buildAuthHeader,
  extractEpicKeyFromIssue,
  fetchJiraIssue,
  resolveStoryEpic,
  resolveEligibleTests,
  uniqueWritableTargets,
  replaceComponentPlaceholder,
  replaceFunctionalPlaceholder,
  writeResolvedEpics,
  buildReport,
};
