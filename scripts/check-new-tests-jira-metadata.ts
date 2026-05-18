#!/usr/bin/env node

/**
 * Validates that newly introduced Cypress tests include the required Jira metadata tags.
 *
 * This script compares the current HEAD against a merge base, scans changed test files under
 * cypress/component and cypress/e2e, parses those files into normalised test units, and then
 * identifies which tests are genuinely new relative to the base version of each file.
 *
 * Component spec files are parsed from the TypeScript AST so titles and tags can be resolved
 * through identifiers, object literals, arrays, spreads, and simple string expressions. Gherkin
 * feature files are parsed line-by-line so feature, rule, scenario, and Examples tags can be
 * attributed to the correct emitted test cases.
 *
 * The check fails when any new test is missing either @JIRA-STORY:<id> or @JIRA-EPIC:<id>,
 * making it suitable for CI enforcement in pull requests.
 */
import * as childProcess from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as ts from 'typescript';

/**
 * Supported test families scanned by this metadata check.
 */
type TestKind = 'component' | 'e2e';

/**
 * Normalised representation of a single parsed test case.
 */
type TestUnit = {
  epics: string[];
  filePath: string;
  id: string;
  kind: TestKind;
  line: number;
  stories: string[];
  title: string;
};

/**
 * Pair of paths used to compare the file at the merge base and at HEAD.
 */
type ChangedTestFile = {
  basePath: string | null;
  headPath: string;
};

/**
 * Parsed test that is missing one or more required Jira tags.
 */
type ValidationFailure = TestUnit & {
  missing: string[];
};

/**
 * TypeScript source file shape including parse diagnostics from createSourceFile.
 */
type SourceFileWithParseDiagnostics = ts.SourceFile & {
  parseDiagnostics?: readonly ts.DiagnosticWithLocation[];
};

/**
 * Test roots and tag prefixes enforced by this script.
 */
const componentRoot = 'cypress/component';
const e2eRoot = 'cypress/e2e';
const jiraEpicPrefix = '@JIRA-EPIC:';
const jiraStoryPrefix = '@JIRA-STORY:';
const scenarioKeywords = ['Scenario Outline:', 'Scenario:', 'Example:'] as const;

/**
 * Reads a CLI argument passed in --name=value form.
 */
function getArgValue(name: string): string | undefined {
  const prefix = `${name}=`;
  const arg = process.argv.slice(2).find((value) => value.startsWith(prefix));

  return arg ? arg.slice(prefix.length) : undefined;
}

/**
 * Runs git synchronously and returns trimmed stdout, optionally tolerating failures.
 */
function runGit(args: string[], allowFailure = false): string {
  const result = childProcess.spawnSync('git', args, {
    cwd: process.cwd(),
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    if (allowFailure) {
      return '';
    }

    const stderr = result.stderr?.trim();
    const stdout = result.stdout?.trim();
    const message = stderr || stdout || `git ${args.join(' ')} failed with code ${result.status}`;
    throw new Error(message);
  }

  return result.stdout.trim();
}

/**
 * Checks whether a git ref resolves locally.
 */
function gitRefExists(ref: string): boolean {
  return (
    childProcess.spawnSync('git', ['rev-parse', '--verify', '--quiet', ref], {
      cwd: process.cwd(),
      encoding: 'utf8',
    }).status === 0
  );
}

/**
 * Chooses the default comparison base, preferring the PR target when available.
 */
function resolveDefaultBaseRef(): string {
  const changeTarget = process.env['CHANGE_TARGET']?.trim();
  const legacyChangeTarget = process.env['ghprbTargetBranch']?.trim();
  const targetBranch = changeTarget || legacyChangeTarget;
  const candidates = targetBranch
    ? [
        `origin/${targetBranch}`,
        `refs/remotes/origin/${targetBranch}`,
        targetBranch,
        `refs/heads/${targetBranch}`,
        'origin/master',
        'refs/remotes/origin/master',
        'master',
        'refs/heads/master',
      ]
    : ['origin/master', 'refs/remotes/origin/master', 'master', 'refs/heads/master'];

  for (const candidate of candidates) {
    if (candidate && gitRefExists(candidate)) {
      return candidate;
    }
  }

  // Jenkins PR jobs often check out a synthetic merge commit without fetching the target branch ref.
  // In that case, the first parent is the target branch tip and still gives the correct PR diff.
  if (gitRefExists('HEAD^1') && gitRefExists('HEAD^2')) {
    return 'HEAD^1';
  }

  throw new Error(
    'Unable to resolve a base ref. Pass --base-ref=<ref> explicitly or ensure the target branch ref, master, or a PR merge parent exists locally.',
  );
}

/**
 * Resolves the merge base used to compare new tests against the target branch.
 */
function getMergeBase(baseRef: string, headRef: string): string {
  return runGit(['merge-base', baseRef, headRef]);
}

/**
 * Collects changed Cypress and feature files, including renames and untracked additions.
 */
function getChangedTestFiles(mergeBase: string): ChangedTestFile[] {
  const nameStatusOutput = runGit(
    ['diff', '--name-status', '--find-renames', '--diff-filter=AMR', mergeBase, '--', componentRoot, e2eRoot],
    true,
  );
  const changedFiles = new Map<string, ChangedTestFile>();

  for (const line of nameStatusOutput.split('\n').filter(Boolean)) {
    const parts = line.split('\t');
    const status = parts[0];

    if (status.startsWith('R')) {
      const basePath = parts[1];
      const headPath = parts[2];

      if (basePath && headPath && isSupportedTestFile(headPath)) {
        changedFiles.set(headPath, { basePath, headPath });
      }

      continue;
    }

    const headPath = parts[1];

    if (headPath && isSupportedTestFile(headPath)) {
      changedFiles.set(headPath, { basePath: status === 'A' ? null : headPath, headPath });
    }
  }

  const untrackedOutput = runGit(['ls-files', '--others', '--exclude-standard', '--', componentRoot, e2eRoot], true);

  for (const headPath of untrackedOutput.split('\n').filter(Boolean)) {
    if (isSupportedTestFile(headPath)) {
      changedFiles.set(headPath, { basePath: null, headPath });
    }
  }

  return [...changedFiles.values()].filter(({ headPath }) => fs.existsSync(path.resolve(process.cwd(), headPath)));
}

/**
 * Limits validation to component spec files and Gherkin feature files.
 */
function isSupportedTestFile(filePath: string): boolean {
  return filePath.endsWith('.cy.ts') || filePath.endsWith('.feature');
}

/**
 * Reads a file from the merge-base tree, returning null when there is no base version.
 */
function readBaseFileContent(mergeBase: string, basePath: string | null): string | null {
  if (!basePath) {
    return null;
  }

  const content = runGit(['show', `${mergeBase}:${basePath}`], true);

  return content === '' ? null : content;
}

/**
 * Dispatches parsing to the appropriate test-file parser.
 */
function parseTestUnits(filePath: string, content: string): TestUnit[] {
  if (filePath.endsWith('.cy.ts')) {
    return parseComponentTests(filePath, content);
  }

  if (filePath.endsWith('.feature')) {
    return parseFeatureTests(filePath, content);
  }

  return [];
}

/**
 * Parses Cypress component tests by walking the TypeScript AST for suites, specs, and tags.
 */
function parseComponentTests(filePath: string, content: string): TestUnit[] {
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const parseDiagnostics = (sourceFile as SourceFileWithParseDiagnostics).parseDiagnostics ?? [];

  if (parseDiagnostics.length > 0) {
    const diagnostic = parseDiagnostics[0];
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    throw new Error(`Failed to parse ${filePath}: ${message}`);
  }

  const declarations = new Map<string, ts.Expression>();

  /**
   * Indexes simple variable declarations so later resolution can follow identifiers.
   */
  function collectDeclarations(node: ts.Node): void {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      declarations.set(node.name.text, node.initializer);
    }

    ts.forEachChild(node, collectDeclarations);
  }

  collectDeclarations(sourceFile);

  const tests: TestUnit[] = [];

  /**
   * Traverses nested suites to build fully-qualified test titles and metadata.
   */
  function visit(node: ts.Node, suiteTitles: string[]): void {
    if (ts.isCallExpression(node)) {
      const suiteTitle = extractSuiteTitle(node, declarations, sourceFile);

      if (suiteTitle) {
        const callback = getLastFunctionArgument(node);

        if (callback?.body) {
          visit(callback.body, [...suiteTitles, suiteTitle]);
        }

        return;
      }

      const testTitle = extractTestTitle(node, declarations, sourceFile);

      if (testTitle) {
        const tags = extractComponentTags(node, declarations, sourceFile);
        const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
        const title = [...suiteTitles, testTitle].join(' > ');

        tests.push({
          epics: tags.filter((tag) => tag.startsWith(jiraEpicPrefix)),
          filePath,
          id: title,
          kind: 'component',
          line: line + 1,
          stories: tags.filter((tag) => tag.startsWith(jiraStoryPrefix)),
          title,
        });

        return;
      }
    }

    ts.forEachChild(node, (child) => visit(child, suiteTitles));
  }

  visit(sourceFile, []);

  return tests;
}

/**
 * Extracts the title from describe/context calls.
 */
function extractSuiteTitle(
  node: ts.CallExpression,
  declarations: Map<string, ts.Expression>,
  sourceFile: ts.SourceFile,
): string | null {
  if (!isCallNamed(node.expression, ['describe', 'context'])) {
    return null;
  }

  const titleArg = node.arguments[0];

  return titleArg ? resolveStringLike(titleArg, declarations, sourceFile) : null;
}

/**
 * Extracts the title from it/specify/test calls.
 */
function extractTestTitle(
  node: ts.CallExpression,
  declarations: Map<string, ts.Expression>,
  sourceFile: ts.SourceFile,
): string | null {
  if (!isCallNamed(node.expression, ['it', 'specify', 'test'])) {
    return null;
  }

  const titleArg = node.arguments[0];

  return titleArg ? resolveStringLike(titleArg, declarations, sourceFile) : null;
}

/**
 * Checks whether an expression resolves to one of the supported call names.
 */
function isCallNamed(expression: ts.LeftHandSideExpression, names: string[]): boolean {
  if (ts.isIdentifier(expression)) {
    return names.includes(expression.text);
  }

  if (ts.isPropertyAccessExpression(expression)) {
    return isCallNamed(expression.expression, names);
  }

  return false;
}

/**
 * Returns the trailing function argument typically used as a Cypress callback body.
 */
function getLastFunctionArgument(node: ts.CallExpression): ts.FunctionLikeDeclarationBase | null {
  for (let index = node.arguments.length - 1; index >= 0; index -= 1) {
    const argument = node.arguments[index];

    if (ts.isArrowFunction(argument) || ts.isFunctionExpression(argument)) {
      return argument;
    }
  }

  return null;
}

/**
 * Reads the tags property from a Cypress test options object.
 */
function extractComponentTags(
  node: ts.CallExpression,
  declarations: Map<string, ts.Expression>,
  sourceFile: ts.SourceFile,
): string[] {
  const optionsArg = node.arguments.find((argument) => {
    if (ts.isObjectLiteralExpression(argument)) {
      return true;
    }

    if (ts.isIdentifier(argument)) {
      const initializer = declarations.get(argument.text);

      return initializer ? ts.isObjectLiteralExpression(stripExpressionWrappers(initializer)) : false;
    }

    return false;
  });

  if (!optionsArg) {
    return [];
  }

  const optionsObject = resolveObjectLiteral(optionsArg, declarations);

  if (!optionsObject) {
    return [];
  }

  for (const property of optionsObject.properties) {
    if (!ts.isPropertyAssignment(property)) {
      continue;
    }

    const propertyName = getPropertyName(property.name);

    if (propertyName === 'tags') {
      return dedupe(resolveTagList(property.initializer, declarations, sourceFile, new Set()));
    }
  }

  return [];
}

/**
 * Resolves an expression back to an object literal, following identifier references.
 */
function resolveObjectLiteral(
  expression: ts.Expression,
  declarations: Map<string, ts.Expression>,
): ts.ObjectLiteralExpression | null {
  const stripped = stripExpressionWrappers(expression);

  if (ts.isObjectLiteralExpression(stripped)) {
    return stripped;
  }

  if (ts.isIdentifier(stripped)) {
    const initializer = declarations.get(stripped.text);

    return initializer ? resolveObjectLiteral(initializer, declarations) : null;
  }

  return null;
}

/**
 * Removes wrapping syntax that does not change the underlying runtime value.
 */
function stripExpressionWrappers(expression: ts.Expression): ts.Expression {
  let current = expression;

  while (
    ts.isAsExpression(current) ||
    ts.isTypeAssertionExpression(current) ||
    ts.isParenthesizedExpression(current) ||
    ts.isSatisfiesExpression(current)
  ) {
    current = current.expression;
  }

  return current;
}

/**
 * Expands a tag expression into a flat list of string tags.
 */
function resolveTagList(
  expression: ts.Expression,
  declarations: Map<string, ts.Expression>,
  sourceFile: ts.SourceFile,
  seen: Set<string>,
): string[] {
  const stripped = stripExpressionWrappers(expression);

  if (ts.isStringLiteral(stripped) || ts.isNoSubstitutionTemplateLiteral(stripped)) {
    return [stripped.text];
  }

  if (ts.isArrayLiteralExpression(stripped)) {
    return stripped.elements.flatMap((element) => {
      if (ts.isSpreadElement(element)) {
        return resolveTagList(element.expression, declarations, sourceFile, seen);
      }

      return resolveTagList(element, declarations, sourceFile, seen);
    });
  }

  if (ts.isIdentifier(stripped)) {
    if (seen.has(stripped.text)) {
      return [];
    }

    const initializer = declarations.get(stripped.text);

    if (!initializer) {
      return [];
    }

    const nextSeen = new Set(seen);
    nextSeen.add(stripped.text);

    return resolveTagList(initializer, declarations, sourceFile, nextSeen);
  }

  if (ts.isCallExpression(stripped)) {
    return stripped.arguments.flatMap((argument) => resolveTagList(argument, declarations, sourceFile, seen));
  }

  if (ts.isBinaryExpression(stripped) && stripped.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const resolved = resolveStringLike(stripped, declarations, sourceFile);

    return resolved ? [resolved] : [];
  }

  if (ts.isConditionalExpression(stripped)) {
    return [
      ...resolveTagList(stripped.whenTrue, declarations, sourceFile, seen),
      ...resolveTagList(stripped.whenFalse, declarations, sourceFile, seen),
    ];
  }

  return [];
}

/**
 * Resolves the best available string value for literals, identifiers, and concatenations.
 */
function resolveStringLike(
  expression: ts.Expression,
  declarations: Map<string, ts.Expression>,
  sourceFile: ts.SourceFile,
  seen = new Set<string>(),
): string | null {
  const stripped = stripExpressionWrappers(expression);

  if (ts.isStringLiteral(stripped) || ts.isNoSubstitutionTemplateLiteral(stripped)) {
    return stripped.text;
  }

  if (ts.isTemplateExpression(stripped)) {
    const pieces = [stripped.head.text];

    for (const span of stripped.templateSpans) {
      const resolved = resolveStringLike(span.expression, declarations, sourceFile, seen);

      if (resolved === null) {
        return stripped.getText(sourceFile);
      }

      pieces.push(resolved, span.literal.text);
    }

    return pieces.join('');
  }

  if (ts.isIdentifier(stripped)) {
    if (seen.has(stripped.text)) {
      return null;
    }

    const initializer = declarations.get(stripped.text);

    if (!initializer) {
      return stripped.getText(sourceFile);
    }

    const nextSeen = new Set(seen);
    nextSeen.add(stripped.text);

    return resolveStringLike(initializer, declarations, sourceFile, nextSeen);
  }

  if (ts.isBinaryExpression(stripped) && stripped.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const left = resolveStringLike(stripped.left, declarations, sourceFile, seen);
    const right = resolveStringLike(stripped.right, declarations, sourceFile, seen);

    return left !== null && right !== null ? `${left}${right}` : stripped.getText(sourceFile);
  }

  return stripped.getText(sourceFile);
}

/**
 * Extracts a comparable string name from supported object property syntaxes.
 */
function getPropertyName(name: ts.PropertyName): string | null {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }

  return null;
}

/**
 * Parses Gherkin feature files into scenario-level test units, including Examples rows.
 */
function parseFeatureTests(filePath: string, content: string): TestUnit[] {
  const lines = content.split(/\r?\n/u);
  const tests: TestUnit[] = [];
  let pendingTags: string[] = [];
  let featureTags: string[] = [];
  let ruleTags: string[] = [];
  /**
   * Tracks the scenario currently being assembled while streaming through the file.
   */
  let currentScenario: {
    exampleCount: number;
    hasExamples: boolean;
    line: number;
    tags: string[];
    title: string;
    usesExamplesAsTests: boolean;
  } | null = null;

  /**
   * Emits the current scenario when it represents a standalone test case.
   */
  function finalizeScenario(): void {
    if (!currentScenario) {
      return;
    }

    if (!currentScenario.usesExamplesAsTests || !currentScenario.hasExamples) {
      tests.push(
        buildFeatureTestUnit(filePath, currentScenario.title, currentScenario.line, currentScenario.tags, null),
      );
    }

    currentScenario = null;
  }

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index];
    const trimmedLine = rawLine.trim();

    if (trimmedLine === '' || trimmedLine.startsWith('#')) {
      continue;
    }

    if (trimmedLine.startsWith('@')) {
      pendingTags = [...pendingTags, ...trimmedLine.split(/\s+/u).filter((token) => token.startsWith('@'))];
      continue;
    }

    if (trimmedLine.startsWith('Feature:')) {
      finalizeScenario();
      featureTags = [...pendingTags];
      ruleTags = [];
      pendingTags = [];
      continue;
    }

    if (trimmedLine.startsWith('Rule:')) {
      finalizeScenario();
      ruleTags = [...pendingTags];
      pendingTags = [];
      continue;
    }

    const scenarioMatch = scenarioKeywords
      .map((keyword) => ({ keyword, title: extractKeywordValue(trimmedLine, keyword) }))
      .find(({ title }) => title !== undefined);

    if (scenarioMatch) {
      finalizeScenario();
      currentScenario = {
        exampleCount: 0,
        hasExamples: false,
        line: index + 1,
        tags: dedupe([...featureTags, ...ruleTags, ...pendingTags]),
        title: scenarioMatch.title ?? '',
        usesExamplesAsTests: scenarioMatch.keyword === 'Scenario Outline:',
      };
      pendingTags = [];
      continue;
    }

    if (trimmedLine.startsWith('Examples:')) {
      if (currentScenario) {
        currentScenario.hasExamples = true;
        currentScenario.exampleCount += 1;
        tests.push(
          buildFeatureTestUnit(
            filePath,
            currentScenario.title,
            index + 1,
            dedupe([...currentScenario.tags, ...pendingTags]),
            currentScenario.exampleCount,
            extractKeywordValue(trimmedLine, 'Examples:'),
          ),
        );
      }

      pendingTags = [];
      continue;
    }

    pendingTags = [];
  }

  finalizeScenario();

  return tests;
}

/**
 * Builds the final test record for a scenario or Examples block.
 */
function buildFeatureTestUnit(
  filePath: string,
  scenarioTitle: string,
  line: number,
  tags: string[],
  exampleIndex: number | null,
  examplesTitle = '',
): TestUnit {
  const suffix = exampleIndex === null ? '' : ` [Examples ${exampleIndex}${examplesTitle ? `: ${examplesTitle}` : ''}]`;
  const title = `${scenarioTitle}${suffix}`;

  return {
    epics: tags.filter((tag) => tag.startsWith(jiraEpicPrefix)),
    filePath,
    id: title,
    kind: 'e2e',
    line,
    stories: tags.filter((tag) => tag.startsWith(jiraStoryPrefix)),
    title,
  };
}

/**
 * Returns the text that follows a Gherkin keyword on a single line.
 */
function extractKeywordValue(line: string, keyword: string): string | undefined {
  if (!line.startsWith(keyword)) {
    return undefined;
  }

  return line.slice(keyword.length).trim();
}

/**
 * Compares parsed head and base tests to identify newly added test units only.
 */
function findNewTests(headUnits: TestUnit[], baseUnits: TestUnit[]): TestUnit[] {
  const baseCounts = new Map<string, number>();

  for (const unit of baseUnits) {
    baseCounts.set(unit.id, (baseCounts.get(unit.id) ?? 0) + 1);
  }

  const newUnits: TestUnit[] = [];

  for (const unit of headUnits) {
    const currentCount = baseCounts.get(unit.id) ?? 0;

    if (currentCount > 0) {
      baseCounts.set(unit.id, currentCount - 1);
      continue;
    }

    newUnits.push(unit);
  }

  return newUnits;
}

/**
 * Removes duplicate tags while preserving first-seen order.
 */
function dedupe(values: string[]): string[] {
  return [...new Set(values)];
}

/**
 * Parses changed files and records any new tests missing required Jira metadata.
 */
function validateNewTests(
  changedFiles: ChangedTestFile[],
  mergeBase: string,
): {
  failures: ValidationFailure[];
  newTests: TestUnit[];
} {
  const failures: ValidationFailure[] = [];
  const newTests: TestUnit[] = [];

  for (const { basePath, headPath } of changedFiles) {
    const absoluteHeadPath = path.resolve(process.cwd(), headPath);
    const headContent = fs.readFileSync(absoluteHeadPath, 'utf8');
    const baseContent = readBaseFileContent(mergeBase, basePath);
    const headUnits = parseTestUnits(headPath, headContent);
    const baseUnits = baseContent ? parseTestUnits(basePath ?? headPath, baseContent) : [];
    const addedUnits = findNewTests(headUnits, baseUnits);

    newTests.push(...addedUnits);

    for (const unit of addedUnits) {
      const missing: string[] = [];

      if (unit.stories.length === 0) {
        missing.push('@JIRA-STORY');
      }

      if (unit.epics.length === 0) {
        missing.push('@JIRA-EPIC');
      }

      if (missing.length > 0) {
        failures.push({ ...unit, missing });
      }
    }
  }

  return { failures, newTests };
}

/**
 * Prints the passing summary when all new tests contain both required tags.
 */
function printSuccess(baseRef: string, mergeBase: string, newTests: TestUnit[]): void {
  if (newTests.length === 0) {
    console.log(`No new component or E2E tests found relative to ${baseRef} (${mergeBase.slice(0, 7)}).`);
    return;
  }

  console.log(`Checked ${newTests.length} new component/E2E tests relative to ${baseRef} (${mergeBase.slice(0, 7)}).`);
  console.log('All new tests include both @JIRA-STORY and @JIRA-EPIC.');
}

/**
 * Prints each metadata failure in a stable file-and-line order.
 */
function printFailures(baseRef: string, mergeBase: string, failures: ValidationFailure[], newTests: TestUnit[]): void {
  console.error(
    `FAIL: ${failures.length} of ${newTests.length} new component/E2E tests are missing Jira metadata relative to ${baseRef} (${mergeBase.slice(0, 7)}).`,
  );

  for (const failure of failures.sort((left, right) => {
    if (left.filePath !== right.filePath) {
      return left.filePath.localeCompare(right.filePath);
    }

    return left.line - right.line;
  })) {
    console.error(
      `- ${failure.filePath}:${failure.line} [${failure.kind}] ${failure.title} | missing ${failure.missing.join(', ')}`,
    );
  }
}

/**
 * Orchestrates diff discovery, parsing, validation, and final reporting.
 */
function main(): void {
  const baseRef = getArgValue('--base-ref') ?? resolveDefaultBaseRef();
  const headRef = getArgValue('--head-ref') ?? 'HEAD';
  const mergeBase = getMergeBase(baseRef, headRef);
  const changedFiles = getChangedTestFiles(mergeBase);
  const { failures, newTests } = validateNewTests(changedFiles, mergeBase);

  if (failures.length > 0) {
    printFailures(baseRef, mergeBase, failures, newTests);
    process.exitCode = 1;
    return;
  }

  printSuccess(baseRef, mergeBase, newTests);
}

main();
