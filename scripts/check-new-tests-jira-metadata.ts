#!/usr/bin/env node

/**
 * Validates Jira metadata on executable tests covered by this policy.
 *
 * Rules enforced:
 * - Component specs must have @JIRA-EPIC:<id> and either @JIRA-STORY:<id> or
 *   @JIRA-DEFECT:<id>
 * - Functional E2E feature tests must have @JIRA-EPIC:<id> and at least one of
 *   @JIRA-STORY:<id>, @JIRA-NFR:<id>, or @JIRA-DEFECT:<id>
 *
 * Smoke tests are intentionally out of scope for this check, and explicit exemptions can be
 * listed below for known placeholder or legacy specs.
 */
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
  defects: string[];
  epics: string[];
  filePath: string;
  id: string;
  kind: TestKind;
  line: number;
  nfrs: string[];
  stories: string[];
  title: string;
};

/**
 * Parsed test that is missing one or more required Jira tags.
 */
type ValidationFailure = TestUnit & {
  missing: string[];
};

/**
 * Test roots and tag prefixes enforced by this script.
 */
const componentRoot = 'cypress/component';
const functionalE2eRoot = 'cypress/e2e/functional/opal/features';
const epicExemptFeatureFiles = new Set([
  'cypress/e2e/functional/opal/features/reciprocalMaintenance/dummyTest.feature',
]);
const jiraDefectPrefix = '@JIRA-DEFECT:';
const jiraEpicPrefix = '@JIRA-EPIC:';
const jiraNfrPrefix = '@JIRA-NFR:';
const jiraStoryPrefix = '@JIRA-STORY:';
const scenarioKeywords = ['Scenario Outline:', 'Scenario:', 'Example:'] as const;

/**
 * TypeScript source file shape including parse diagnostics from createSourceFile.
 */
type SourceFileWithParseDiagnostics = ts.SourceFile & {
  parseDiagnostics?: readonly ts.DiagnosticWithLocation[];
};

/**
 * Simplified description of a function that can participate in tag resolution.
 */
type FunctionDefinition = {
  bodyExpression: ts.Expression | null;
  parameters: { isRest: boolean; name: string }[];
};

/**
 * TypeScript declarations and callable helpers used while resolving tag expressions.
 */
type ResolverContext = {
  declarations: Map<string, ts.Expression>;
  functions: Map<string, FunctionDefinition>;
};

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

  const resolverContext = createResolverContext(sourceFile);
  const tests: TestUnit[] = [];

  /**
   * Traverses nested suites to build fully-qualified test titles and metadata.
   */
  function visit(node: ts.Node, suiteTitles: string[], inheritedTags: string[]): void {
    if (ts.isCallExpression(node)) {
      const suiteTitle = extractSuiteTitle(node, resolverContext, sourceFile);

      if (suiteTitle) {
        const suiteTags = extractComponentTags(node, resolverContext, sourceFile);
        const callback = getLastFunctionArgument(node);

        if (callback?.body) {
          visit(callback.body, [...suiteTitles, suiteTitle], dedupe([...inheritedTags, ...suiteTags]));
        }

        return;
      }

      const testTitle = extractTestTitle(node, resolverContext, sourceFile);

      if (testTitle) {
        const tags = dedupe([...inheritedTags, ...extractComponentTags(node, resolverContext, sourceFile)]);
        const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
        const title = [...suiteTitles, testTitle].join(' > ');

        tests.push({
          defects: tags.filter((tag) => tag.startsWith(jiraDefectPrefix)),
          epics: tags.filter((tag) => tag.startsWith(jiraEpicPrefix)),
          filePath,
          id: title,
          kind: 'component',
          line: line + 1,
          nfrs: tags.filter((tag) => tag.startsWith(jiraNfrPrefix)),
          stories: tags.filter((tag) => tag.startsWith(jiraStoryPrefix)),
          title,
        });

        return;
      }
    }

    ts.forEachChild(node, (child) => visit(child, suiteTitles, inheritedTags));
  }

  visit(sourceFile, [], []);

  return tests;
}

/**
 * Extracts the title from describe/context calls.
 */
function extractSuiteTitle(
  node: ts.CallExpression,
  resolverContext: ResolverContext,
  sourceFile: ts.SourceFile,
): string | null {
  if (!isCallNamed(node.expression, ['describe', 'context'])) {
    return null;
  }

  const titleArg = node.arguments[0];

  return titleArg ? resolveStringLike(titleArg, resolverContext, sourceFile) : null;
}

/**
 * Extracts the title from it/specify/test calls.
 */
function extractTestTitle(
  node: ts.CallExpression,
  resolverContext: ResolverContext,
  sourceFile: ts.SourceFile,
): string | null {
  if (!isCallNamed(node.expression, ['it', 'specify', 'test'])) {
    return null;
  }

  const titleArg = node.arguments[0];

  return titleArg ? resolveStringLike(titleArg, resolverContext, sourceFile) : null;
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
  resolverContext: ResolverContext,
  sourceFile: ts.SourceFile,
): string[] {
  const optionsArg = node.arguments.find((argument) => {
    if (ts.isObjectLiteralExpression(argument)) {
      return true;
    }

    if (ts.isIdentifier(argument)) {
      const initializer = resolverContext.declarations.get(argument.text);

      return initializer ? ts.isObjectLiteralExpression(stripExpressionWrappers(initializer)) : false;
    }

    return false;
  });

  if (!optionsArg) {
    return [];
  }

  const optionsObject = resolveObjectLiteral(optionsArg, resolverContext.declarations);

  if (!optionsObject) {
    return [];
  }

  for (const property of optionsObject.properties) {
    if (!ts.isPropertyAssignment(property)) {
      continue;
    }

    const propertyName = getPropertyName(property.name);

    if (propertyName === 'tags') {
      return dedupe(resolveTagList(property.initializer, resolverContext, sourceFile, new Set(), new Map(), new Set()));
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
 * Indexes simple variable declarations and helper functions for later tag resolution.
 */
function createResolverContext(sourceFile: ts.SourceFile): ResolverContext {
  const declarations = new Map<string, ts.Expression>();
  const functions = new Map<string, FunctionDefinition>();

  /**
   * Collects declarations and helper functions in a single pass over the file.
   */
  function collect(node: ts.Node): void {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      declarations.set(node.name.text, node.initializer);

      if (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer)) {
        functions.set(node.name.text, createFunctionDefinition(node.initializer));
      }
    }

    if (ts.isFunctionDeclaration(node) && node.name) {
      functions.set(node.name.text, createFunctionDefinition(node));
    }

    ts.forEachChild(node, collect);
  }

  collect(sourceFile);

  return { declarations, functions };
}

/**
 * Converts a function-like declaration into a simplified structure for expression evaluation.
 */
function createFunctionDefinition(functionLike: ts.FunctionLikeDeclarationBase): FunctionDefinition {
  return {
    bodyExpression: getReturnedExpression(functionLike),
    parameters: functionLike.parameters.flatMap((parameter) => {
      if (!ts.isIdentifier(parameter.name)) {
        return [];
      }

      return [{ isRest: Boolean(parameter.dotDotDotToken), name: parameter.name.text }];
    }),
  };
}

/**
 * Retrieves the expression returned by a function, or the expression body for concise arrows.
 */
function getReturnedExpression(functionLike: ts.FunctionLikeDeclarationBase): ts.Expression | null {
  if (!functionLike.body) {
    return null;
  }

  if (ts.isExpression(functionLike.body)) {
    return functionLike.body;
  }

  for (const statement of functionLike.body.statements) {
    if (ts.isReturnStatement(statement) && statement.expression) {
      return statement.expression;
    }
  }

  return null;
}

/**
 * Expands a tag expression into a flat list of string tags.
 */
function resolveTagList(
  expression: ts.Expression,
  resolverContext: ResolverContext,
  sourceFile: ts.SourceFile,
  seen: Set<string>,
  parameterBindings: Map<string, ts.Expression | ts.Expression[]>,
  activeFunctions: Set<string>,
): string[] {
  if (ts.isSpreadElement(expression)) {
    return resolveTagList(expression.expression, resolverContext, sourceFile, seen, parameterBindings, activeFunctions);
  }

  const stripped = stripExpressionWrappers(expression);

  if (ts.isStringLiteral(stripped) || ts.isNoSubstitutionTemplateLiteral(stripped)) {
    return [stripped.text];
  }

  if (ts.isArrayLiteralExpression(stripped)) {
    return stripped.elements.flatMap((element) => {
      if (ts.isSpreadElement(element)) {
        return resolveTagList(
          element.expression,
          resolverContext,
          sourceFile,
          seen,
          parameterBindings,
          activeFunctions,
        );
      }

      return resolveTagList(element, resolverContext, sourceFile, seen, parameterBindings, activeFunctions);
    });
  }

  if (ts.isIdentifier(stripped)) {
    const boundValue = parameterBindings.get(stripped.text);

    if (boundValue) {
      return Array.isArray(boundValue)
        ? boundValue.flatMap((value) =>
            resolveTagList(value, resolverContext, sourceFile, seen, parameterBindings, activeFunctions),
          )
        : resolveTagList(boundValue, resolverContext, sourceFile, seen, parameterBindings, activeFunctions);
    }

    if (seen.has(stripped.text)) {
      return [];
    }

    const initializer = resolverContext.declarations.get(stripped.text);

    if (!initializer) {
      return [];
    }

    const nextSeen = new Set(seen);
    nextSeen.add(stripped.text);

    return resolveTagList(initializer, resolverContext, sourceFile, nextSeen, parameterBindings, activeFunctions);
  }

  if (ts.isCallExpression(stripped)) {
    const resolvedCallTags = resolveTagListFromCall(
      stripped,
      resolverContext,
      sourceFile,
      seen,
      parameterBindings,
      activeFunctions,
    );

    if (resolvedCallTags) {
      return resolvedCallTags;
    }

    return stripped.arguments.flatMap((argument) =>
      resolveTagList(argument, resolverContext, sourceFile, seen, parameterBindings, activeFunctions),
    );
  }

  if (ts.isBinaryExpression(stripped) && stripped.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const resolved = resolveStringLike(stripped, resolverContext, sourceFile, parameterBindings);

    return resolved ? [resolved] : [];
  }

  if (ts.isConditionalExpression(stripped)) {
    return [
      ...resolveTagList(stripped.whenTrue, resolverContext, sourceFile, seen, parameterBindings, activeFunctions),
      ...resolveTagList(stripped.whenFalse, resolverContext, sourceFile, seen, parameterBindings, activeFunctions),
    ];
  }

  return [];
}

/**
 * Resolves tags returned by supported helper functions such as buildTags(...).
 */
function resolveTagListFromCall(
  callExpression: ts.CallExpression,
  resolverContext: ResolverContext,
  sourceFile: ts.SourceFile,
  seen: Set<string>,
  parameterBindings: Map<string, ts.Expression | ts.Expression[]>,
  activeFunctions: Set<string>,
): string[] | null {
  const functionName = getCalledFunctionName(callExpression.expression);

  if (!functionName) {
    return null;
  }

  const functionDefinition = resolverContext.functions.get(functionName);

  if (!functionDefinition?.bodyExpression || activeFunctions.has(functionName)) {
    return null;
  }

  const nextBindings = new Map(parameterBindings);

  for (let index = 0; index < functionDefinition.parameters.length; index += 1) {
    const parameter = functionDefinition.parameters[index];

    if (parameter.isRest) {
      nextBindings.set(parameter.name, callExpression.arguments.slice(index));
      continue;
    }

    const argument = callExpression.arguments[index];

    if (argument) {
      nextBindings.set(parameter.name, argument);
    }
  }

  const nextActiveFunctions = new Set(activeFunctions);
  nextActiveFunctions.add(functionName);

  return resolveTagList(
    functionDefinition.bodyExpression,
    resolverContext,
    sourceFile,
    seen,
    nextBindings,
    nextActiveFunctions,
  );
}

/**
 * Returns the best available simple name for a called helper function.
 */
function getCalledFunctionName(expression: ts.LeftHandSideExpression): string | null {
  if (ts.isIdentifier(expression)) {
    return expression.text;
  }

  if (ts.isPropertyAccessExpression(expression)) {
    return expression.name.text;
  }

  return null;
}

/**
 * Resolves the best available string value for literals, identifiers, and concatenations.
 */
function resolveStringLike(
  expression: ts.Expression,
  resolverContext: ResolverContext,
  sourceFile: ts.SourceFile,
  parameterBindings = new Map<string, ts.Expression | ts.Expression[]>(),
  seen = new Set<string>(),
): string | null {
  const stripped = stripExpressionWrappers(expression);

  if (ts.isStringLiteral(stripped) || ts.isNoSubstitutionTemplateLiteral(stripped)) {
    return stripped.text;
  }

  if (ts.isTemplateExpression(stripped)) {
    const pieces = [stripped.head.text];

    for (const span of stripped.templateSpans) {
      const resolved = resolveStringLike(span.expression, resolverContext, sourceFile, parameterBindings, seen);

      if (resolved === null) {
        return stripped.getText(sourceFile);
      }

      pieces.push(resolved, span.literal.text);
    }

    return pieces.join('');
  }

  if (ts.isIdentifier(stripped)) {
    const boundValue = parameterBindings.get(stripped.text);

    if (boundValue) {
      if (Array.isArray(boundValue)) {
        return boundValue.length === 1
          ? resolveStringLike(boundValue[0], resolverContext, sourceFile, parameterBindings, seen)
          : stripped.getText(sourceFile);
      }

      return resolveStringLike(boundValue, resolverContext, sourceFile, parameterBindings, seen);
    }

    if (seen.has(stripped.text)) {
      return null;
    }

    const initializer = resolverContext.declarations.get(stripped.text);

    if (!initializer) {
      return stripped.getText(sourceFile);
    }

    const nextSeen = new Set(seen);
    nextSeen.add(stripped.text);

    return resolveStringLike(initializer, resolverContext, sourceFile, parameterBindings, nextSeen);
  }

  if (ts.isBinaryExpression(stripped) && stripped.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const left = resolveStringLike(stripped.left, resolverContext, sourceFile, parameterBindings, seen);
    const right = resolveStringLike(stripped.right, resolverContext, sourceFile, parameterBindings, seen);

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

    if (!currentScenario.hasExamples) {
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
    defects: tags.filter((tag) => tag.startsWith(jiraDefectPrefix)),
    epics: tags.filter((tag) => tag.startsWith(jiraEpicPrefix)),
    filePath,
    id: title,
    kind: 'e2e',
    line,
    nfrs: tags.filter((tag) => tag.startsWith(jiraNfrPrefix)),
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
 * Restricts validation to component specs and functional E2E feature files covered by this policy.
 */
function isSupportedTestFile(filePath: string): boolean {
  if (filePath.endsWith('.cy.ts')) {
    return filePath.startsWith(`${componentRoot}/`);
  }

  if (filePath.endsWith('.feature')) {
    return filePath.startsWith(`${functionalE2eRoot}/`) && !epicExemptFeatureFiles.has(filePath);
  }

  return false;
}

/**
 * Recursively lists all supported component and functional E2E test files under a root directory.
 */
function listSupportedTestFiles(rootDirectory: string): string[] {
  const absoluteRoot = path.resolve(process.cwd(), rootDirectory);

  if (!fs.existsSync(absoluteRoot)) {
    return [];
  }

  const files: string[] = [];

  /**
   * Walks the file tree and records supported test files using repo-relative paths.
   */
  function walk(directory: string): void {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolutePath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        walk(absolutePath);
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      const relativePath = path.relative(process.cwd(), absolutePath).split(path.sep).join('/');

      if (isSupportedTestFile(relativePath)) {
        files.push(relativePath);
      }
    }
  }

  walk(absoluteRoot);

  return files.sort((left, right) => left.localeCompare(right));
}

/**
 * Removes duplicate tags while preserving first-seen order.
 */
function dedupe(values: string[]): string[] {
  return [...new Set(values)];
}

/**
 * Parses all covered files and records any tests missing the required Jira metadata for their type.
 */
function validateAllTests(testFiles: string[]): {
  failures: ValidationFailure[];
  tests: TestUnit[];
} {
  const failures: ValidationFailure[] = [];
  const tests: TestUnit[] = [];

  for (const testFile of testFiles) {
    const absoluteFilePath = path.resolve(process.cwd(), testFile);
    const content = fs.readFileSync(absoluteFilePath, 'utf8');
    const units = parseTestUnits(testFile, content);

    tests.push(...units);

    for (const unit of units) {
      const missing: string[] = [];

      if (unit.kind === 'component' && unit.stories.length === 0 && unit.defects.length === 0) {
        missing.push('@JIRA-STORY or @JIRA-DEFECT');
      }

      if (unit.kind === 'e2e' && unit.stories.length === 0 && unit.nfrs.length === 0 && unit.defects.length === 0) {
        missing.push('@JIRA-STORY or @JIRA-NFR or @JIRA-DEFECT');
      }

      if (unit.epics.length === 0) {
        missing.push('@JIRA-EPIC');
      }

      if (missing.length > 0) {
        failures.push({ ...unit, missing });
      }
    }
  }

  return { failures, tests };
}

/**
 * Prints the passing summary when all covered tests satisfy the current metadata policy.
 */
function printSuccess(tests: TestUnit[]): void {
  if (tests.length === 0) {
    console.log('No covered component or functional E2E tests were found.');
    return;
  }

  console.log(`Checked ${tests.length} covered component/functional E2E tests.`);
  console.log(
    'Component tests include @JIRA-EPIC and either @JIRA-STORY or @JIRA-DEFECT. Functional E2E tests include @JIRA-EPIC and at least one of @JIRA-STORY, @JIRA-NFR, or @JIRA-DEFECT.',
  );
}

/**
 * Prints each metadata failure in a stable file-and-line order.
 */
function printFailures(failures: ValidationFailure[], tests: TestUnit[]): void {
  console.error(
    `FAIL: ${failures.length} of ${tests.length} covered component/functional E2E tests are missing required Jira metadata.`,
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
 * Lists every covered component and functional E2E test file that must satisfy this policy.
 */
function getCoveredTestFiles(): string[] {
  return dedupe([...listSupportedTestFiles(componentRoot), ...listSupportedTestFiles(functionalE2eRoot)]).sort(
    (left, right) => left.localeCompare(right),
  );
}

/**
 * Orchestrates discovery, parsing, validation, and final reporting.
 */
function main(): void {
  const coveredTestFiles = getCoveredTestFiles();
  const { failures, tests } = validateAllTests(coveredTestFiles);

  if (failures.length > 0) {
    printFailures(failures, tests);
    process.exitCode = 1;
    return;
  }

  printSuccess(tests);
}

main();
