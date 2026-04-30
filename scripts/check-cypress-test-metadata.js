#!/usr/bin/env node

/**
 * Audit Cypress component specs and Opal functional features for:
 * - missing `@JIRA-STORY:*` tags
 * - missing `@JIRA-KEY:POT-*` tags
 * - component tag shapes that Zephyr cannot rewrite to add a POT tag
 * - multiple POT tags on one executable test
 * - shared POT tags across executable tests
 * - duplicate test names
 *
 * The report is written to CSV so it can be inspected locally or archived in CI.
 *
 * Usage:
 *   node scripts/check-cypress-test-metadata.js
 *   node scripts/check-cypress-test-metadata.js --output=tmp/my-report.csv
 */

const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const { Parser, AstBuilder, GherkinClassicTokenMatcher, compile } = require('@cucumber/gherkin');
const { IdGenerator } = require('@cucumber/messages');

const ROOT = process.cwd();
const COMPONENT_ROOT = path.join(ROOT, 'cypress', 'component');
const FUNCTIONAL_ROOT = path.join(ROOT, 'cypress', 'e2e', 'functional', 'opal');
const DEFAULT_OUTPUT = path.join(ROOT, 'tmp', 'cypress-test-metadata-report.csv');

const STORY_TAG_RE = /^@JIRA-STORY:/;
const POT_TAG_RE = /^@JIRA-KEY:POT-\d+$/;
const SKIP_TAG = '@skip';
const DUMMY_FEATURE_RE = /(?:^|\/)dummytest\.feature$/i;

/**
 * Walk a directory recursively and collect files with the given suffix.
 * @param {string} dir
 * @param {string} suffix
 * @param {string[]} out
 * @returns {string[]}
 */
function walk(dir, suffix, out = []) {
  if (!fs.existsSync(dir)) return out;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, suffix, out);
      continue;
    }
    if (entry.isFile() && full.endsWith(suffix)) out.push(full);
  }

  return out;
}

/**
 * Return a stable repo-relative path.
 * @param {string} file
 * @returns {string}
 */
function rel(file) {
  return path.relative(ROOT, file).split(path.sep).join('/');
}

/**
 * Return a deduplicated copy of an array.
 * @template T
 * @param {T[]} values
 * @returns {T[]}
 */
function uniq(values) {
  return [...new Set(values)];
}

/**
 * Return whether a test should be excluded from metadata auditing.
 * Tests already marked `@skip` are intentionally ignored.
 * @param {{ tags?: string[] }} test
 * @returns {boolean}
 */
function shouldIgnoreTest(test) {
  return (
    (Array.isArray(test?.tags) && test.tags.includes(SKIP_TAG)) ||
    (typeof test?.file === 'string' && DUMMY_FEATURE_RE.test(test.file))
  );
}

/**
 * Escape one CSV cell.
 * @param {string | number | undefined | null} value
 * @returns {string}
 */
function csvEscape(value) {
  const str = String(value ?? '');
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

/**
 * Convert rows to CSV text.
 * @param {Array<Record<string, string | number>>} rows
 * @param {string[]} headers
 * @returns {string}
 */
function toCsv(rows, headers) {
  const lines = [headers.map(csvEscape).join(',')];
  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header])).join(','));
  }
  return `${lines.join('\n')}\n`;
}

/**
 * Parse `--output=<path>`.
 * @returns {string}
 */
function resolveOutputPath() {
  const outputArg = process.argv.slice(2).find((arg) => arg.startsWith('--output='));
  if (!outputArg) return DEFAULT_OUTPUT;

  const value = outputArg.slice('--output='.length).trim();
  if (!value) return DEFAULT_OUTPUT;

  return path.isAbsolute(value) ? value : path.join(ROOT, value);
}

/**
 * Build an AST location index for Gherkin node ids.
 * @param {unknown} value
 * @param {Map<string, number>} map
 * @returns {Map<string, number>}
 */
function mapAstLocations(value, map = new Map()) {
  if (!value || typeof value !== 'object') return map;

  if (value.id && value.location && typeof value.location.line === 'number') {
    map.set(value.id, value.location.line);
  }

  if (Array.isArray(value)) {
    for (const item of value) mapAstLocations(item, map);
    return map;
  }

  for (const nested of Object.values(value)) {
    mapAstLocations(nested, map);
  }

  return map;
}

/**
 * Build an AST metadata index for Gherkin node ids.
 * The metadata tracks the node kind plus the line where a tag should be attached.
 * @param {unknown} value
 * @param {Map<string, { kind: string, line: number, tagAnchorLine: number }>} map
 * @returns {Map<string, { kind: string, line: number, tagAnchorLine: number }>}
 */
function mapAstMetadata(value, map = new Map()) {
  if (!value || typeof value !== 'object') return map;

  if (value.id && value.location && typeof value.location.line === 'number') {
    const tags = Array.isArray(value.tags) ? value.tags : [];
    const firstTagLine =
      tags.length > 0 && tags[0]?.location && typeof tags[0].location.line === 'number' ? tags[0].location.line : null;

    const meta = {
      kind: typeof value.keyword === 'string' ? value.keyword.trim() : typeof value.name === 'string' ? value.name : '',
      line: value.location.line,
      tagAnchorLine: firstTagLine || value.location.line,
    };

    const existingMeta = map.get(value.id);
    if (!existingMeta || meta.kind) {
      map.set(value.id, meta);
    }

    if (meta.kind === 'Examples') {
      if (value.tableHeader?.id) {
        map.set(value.tableHeader.id, meta);
      }

      if (Array.isArray(value.tableBody)) {
        for (const row of value.tableBody) {
          if (row?.id) map.set(row.id, meta);
        }
      }
    }
  }

  if (Array.isArray(value)) {
    for (const item of value) mapAstMetadata(item, map);
    return map;
  }

  for (const nested of Object.values(value)) {
    mapAstMetadata(nested, map);
  }

  return map;
}

/**
 * Extract executable functional tests by compiling pickles, including Scenario Outline example expansions.
 * @param {string} file
 * @returns {ExecutableTest[]}
 */
function extractFunctionalTests(file) {
  const source = fs.readFileSync(file, 'utf8');
  const uuidFn = IdGenerator.uuid();
  const parser = new Parser(new AstBuilder(uuidFn), new GherkinClassicTokenMatcher());
  const document = parser.parse(source);
  const pickles = compile(document, rel(file), uuidFn);
  const lineByNodeId = mapAstLocations(document);
  const metaByNodeId = mapAstMetadata(document);
  const featureTitle = document.feature?.name?.trim() || path.basename(file);

  return pickles.map((pickle) => {
    let line = 1;
    for (const id of [...(pickle.astNodeIds || [])].reverse()) {
      if (lineByNodeId.has(id)) {
        line = lineByNodeId.get(id);
        break;
      }
    }

    const examplesMeta = (pickle.astNodeIds || [])
      .map((id) => metaByNodeId.get(id))
      .find((meta) => meta && meta.kind === 'Examples');
    const scenarioMeta = (pickle.astNodeIds || [])
      .map((id) => metaByNodeId.get(id))
      .find((meta) => meta && (meta.kind === 'Scenario' || meta.kind === 'Scenario Outline'));
    const tagTargetMeta = examplesMeta || scenarioMeta;

    return {
      scope: 'functional',
      file: rel(file),
      line,
      title: pickle.name,
      qualifiedTitle: `${featureTitle} > ${pickle.name}`,
      tags: uniq((pickle.tags || []).map((tag) => tag.name)),
      tagEdit: tagTargetMeta
        ? {
            kind: 'functional_gherkin_block',
            anchorLine: tagTargetMeta.tagAnchorLine,
          }
        : undefined,
    };
  });
}

/**
 * Extract executable component tests from Cypress specs, following helper functions that define `describe()` / `it()`.
 * @param {string} file
 * @returns {ExecutableTest[]}
 */
function extractComponentTests(file) {
  const sourceText = fs.readFileSync(file, 'utf8');
  const sourceFile = ts.createSourceFile(file, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

  /** @type {Map<string, import('typescript').Expression>} */
  const constInitializers = new Map();
  /** @type {Map<string, import('typescript').FunctionLikeDeclaration>} */
  const functionDefs = new Map();

  /**
   * Collect top-level declarations we can resolve later.
   * @param {import('typescript').Node} node
   * @returns {void}
   */
  function collect(node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      constInitializers.set(node.name.text, node.initializer);
      if (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer)) {
        functionDefs.set(node.name.text, node.initializer);
      }
    }
    if (ts.isFunctionDeclaration(node) && node.name) {
      functionDefs.set(node.name.text, node);
    }
    ts.forEachChild(node, collect);
  }

  collect(sourceFile);

  const constCache = new Map();
  const resolvingConsts = new Set();
  const fnSpecCache = new Map();

  /**
   * Strip TS wrappers like `as`, non-null assertions, and parentheses.
   * @param {import('typescript').Node | undefined} node
   * @returns {import('typescript').Node | undefined}
   */
  function unwrap(node) {
    let current = node;
    while (
      current &&
      (ts.isParenthesizedExpression(current) ||
        ts.isAsExpression(current) ||
        (ts.isTypeAssertionExpression && ts.isTypeAssertionExpression(current)) ||
        ts.isNonNullExpression(current))
    ) {
      current = current.expression;
    }
    return current;
  }

  /**
   * Resolve a constant or bound function parameter.
   * @param {string} name
   * @param {Map<string, unknown>} env
   * @returns {unknown}
   */
  function resolveConst(name, env) {
    if (env?.has(name)) return env.get(name);
    if (constCache.has(name)) return constCache.get(name);
    if (resolvingConsts.has(name)) return undefined;

    const initializer = constInitializers.get(name);
    if (!initializer) return undefined;

    resolvingConsts.add(name);
    const value = evalExpr(initializer, env);
    resolvingConsts.delete(name);
    constCache.set(name, value);
    return value;
  }

  /**
   * Return the body for a helper function.
   * @param {import('typescript').FunctionLikeDeclaration | undefined} fn
   * @returns {import('typescript').Node | undefined}
   */
  function getFnBody(fn) {
    if (!fn) return undefined;
    if (ts.isArrowFunction(fn)) return fn.body;
    return fn.body;
  }

  /**
   * Return the returned expression for helpers like `buildTags(...) => [...]`.
   * @param {import('typescript').FunctionLikeDeclaration | undefined} fn
   * @returns {import('typescript').Expression | undefined}
   */
  function getFnReturnExpr(fn) {
    if (!fn) return undefined;

    if (ts.isArrowFunction(fn)) {
      if (!ts.isBlock(fn.body)) return fn.body;
      return fn.body.statements.find(ts.isReturnStatement)?.expression;
    }

    if (!fn.body) return undefined;
    return fn.body.statements.find(ts.isReturnStatement)?.expression;
  }

  /**
   * Check whether an expression is one of the Cypress spec builders we care about.
   * @param {import('typescript').LeftHandSideExpression} expr
   * @param {string[]} names
   * @returns {boolean}
   */
  function isCallNamed(expr, names) {
    if (ts.isIdentifier(expr)) return names.includes(expr.text);
    if (ts.isPropertyAccessExpression(expr) && ts.isIdentifier(expr.expression)) {
      return names.includes(expr.expression.text);
    }
    return false;
  }

  /**
   * Decide whether a helper function contains nested `describe()` / `it()` declarations.
   * @param {string} name
   * @param {Set<string>} seen
   * @returns {boolean}
   */
  function fnContainsSpec(name, seen = new Set()) {
    if (fnSpecCache.has(name)) return fnSpecCache.get(name);
    if (seen.has(name)) return false;
    seen.add(name);

    const fn = functionDefs.get(name);
    if (!fn) return false;

    let found = false;

    /**
     * @param {import('typescript').Node} node
     * @returns {void}
     */
    function scan(node) {
      if (found) return;

      if (ts.isCallExpression(node)) {
        if (isCallNamed(node.expression, ['it', 'test', 'specify', 'describe', 'context'])) {
          found = true;
          return;
        }

        const callee = unwrap(node.expression);
        if (ts.isIdentifier(callee) && fnContainsSpec(callee.text, seen)) {
          found = true;
          return;
        }
      }

      if (
        (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node)) &&
        node !== fn
      ) {
        return;
      }

      ts.forEachChild(node, scan);
    }

    const body = getFnBody(fn);
    if (body) scan(body);

    fnSpecCache.set(name, found);
    return found;
  }

  /**
   * Bind helper call arguments to parameter names for simple static evaluation.
   * @param {import('typescript').FunctionLikeDeclaration} fn
   * @param {import('typescript').NodeArray<import('typescript').Expression>} args
   * @param {Map<string, unknown>} callerEnv
   * @returns {Map<string, unknown>}
   */
  function bindArgs(fn, args, callerEnv) {
    const env = new Map(callerEnv ? [...callerEnv.entries()] : []);
    let argIndex = 0;

    for (const param of fn.parameters || []) {
      if (!ts.isIdentifier(param.name)) continue;

      if (param.dotDotDotToken) {
        const rest = [];
        for (; argIndex < args.length; argIndex++) {
          const arg = args[argIndex];
          const value = evalExpr(ts.isSpreadElement(arg) ? arg.expression : arg, callerEnv);
          if (Array.isArray(value)) rest.push(...value);
          else if (value !== undefined) rest.push(value);
        }
        env.set(param.name.text, rest);
        continue;
      }

      const arg = args[argIndex++];
      env.set(param.name.text, arg ? evalExpr(ts.isSpreadElement(arg) ? arg.expression : arg, callerEnv) : undefined);
    }

    return env;
  }

  /**
   * Evaluate helper calls that build arrays/strings/objects used in tags or titles.
   * @param {import('typescript').CallExpression} node
   * @param {Map<string, unknown>} env
   * @returns {unknown}
   */
  function evalCallValue(node, env) {
    const callee = unwrap(node.expression);
    if (!ts.isIdentifier(callee)) return undefined;

    const fn = functionDefs.get(callee.text);
    if (!fn) return undefined;

    const retExpr = getFnReturnExpr(fn);
    if (!retExpr) return undefined;

    return evalExpr(retExpr, bindArgs(fn, node.arguments, env));
  }

  /**
   * Evaluate simple AST expressions needed for static metadata extraction.
   * @param {import('typescript').Node | undefined} node
   * @param {Map<string, unknown>} env
   * @returns {unknown}
   */
  function evalExpr(node, env = new Map()) {
    node = unwrap(node);
    if (!node) return undefined;

    if (ts.isSpreadElement(node)) return evalExpr(node.expression, env);
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
    if (ts.isNumericLiteral(node)) return Number(node.text);
    if (ts.isTemplateExpression(node)) {
      let text = node.head.text;
      for (const span of node.templateSpans) {
        const expressionValue = evalExpr(span.expression, env);
        if (expressionValue === undefined) return undefined;
        text += String(expressionValue);
        text += span.literal.text;
      }
      return text;
    }
    if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
    if (ts.isIdentifier(node)) return resolveConst(node.text, env);

    if (ts.isArrayLiteralExpression(node)) {
      const values = [];
      for (const element of node.elements) {
        const value = evalExpr(element, env);
        if (Array.isArray(value)) values.push(...value);
        else if (value !== undefined) values.push(value);
      }
      return values;
    }

    if (ts.isObjectLiteralExpression(node)) {
      const obj = {};
      for (const prop of node.properties) {
        if (ts.isPropertyAssignment(prop)) {
          const key =
            ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name) || ts.isNumericLiteral(prop.name)
              ? prop.name.text
              : undefined;
          if (!key) continue;
          obj[key] = evalExpr(prop.initializer, env);
          continue;
        }

        if (ts.isShorthandPropertyAssignment(prop)) {
          obj[prop.name.text] = resolveConst(prop.name.text, env);
        }
      }
      return obj;
    }

    if (ts.isPropertyAccessExpression(node)) {
      const obj = evalExpr(node.expression, env);
      if (obj && typeof obj === 'object' && node.name.text in obj) return obj[node.name.text];
      return undefined;
    }

    if (ts.isElementAccessExpression(node)) {
      const obj = evalExpr(node.expression, env);
      const key = evalExpr(node.argumentExpression, env);
      if (obj && typeof obj === 'object' && key in obj) return obj[key];
      return undefined;
    }

    if (ts.isCallExpression(node)) return evalCallValue(node, env);

    if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
      const left = evalExpr(node.left, env);
      const right = evalExpr(node.right, env);
      if (typeof left === 'string' && typeof right === 'string') return left + right;
    }

    return undefined;
  }

  /**
   * Read `{ tags: ... }` or shorthand `{ tags }` objects used by Cypress metadata.
   * @param {import('typescript').ObjectLiteralExpression | undefined} config
   * @param {Map<string, unknown>} env
   * @returns {string[]}
   */
  function extractTags(config, env) {
    if (!config) return [];

    for (const prop of config.properties) {
      if (ts.isPropertyAssignment(prop)) {
        const key = ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name) ? prop.name.text : undefined;
        if (key !== 'tags') continue;

        const value = evalExpr(prop.initializer, env);
        if (Array.isArray(value)) return value.filter((item) => typeof item === 'string');
        if (typeof value === 'string') return [value];
      }

      if (ts.isShorthandPropertyAssignment(prop) && prop.name.text === 'tags') {
        const value = resolveConst('tags', env);
        if (Array.isArray(value)) return value.filter((item) => typeof item === 'string');
        if (typeof value === 'string') return [value];
      }
    }

    return [];
  }

  /**
   * Find the `tags` property within a Cypress config object.
   * @param {import('typescript').ObjectLiteralExpression | undefined} config
   * @returns {import('typescript').ObjectLiteralElementLike | undefined}
   */
  function findTagsProperty(config) {
    if (!config) return undefined;

    for (const prop of config.properties) {
      if (ts.isPropertyAssignment(prop)) {
        const key = ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name) ? prop.name.text : undefined;
        if (key === 'tags') return prop;
      }

      if (ts.isShorthandPropertyAssignment(prop) && prop.name.text === 'tags') {
        return prop;
      }
    }

    return undefined;
  }

  /**
   * Return whether Zephyr can safely inject a POT tag into this `it(...)` call.
   * Zephyr's Cypress tagger only rewrites tests when the config is inline and
   * `tags` is either absent or a literal array expression.
   * @param {import('typescript').CallExpression} node
   * @returns {boolean}
   */
  function isAutoPotWritableTest(node) {
    if (node.arguments.length < 3) return true;

    const maybeConfig = unwrap(node.arguments[1]);
    if (!maybeConfig) return true;
    if (!ts.isObjectLiteralExpression(maybeConfig)) return false;

    const tagsProp = findTagsProperty(maybeConfig);
    if (!tagsProp) return true;
    if (!ts.isPropertyAssignment(tagsProp)) return false;

    return ts.isArrayLiteralExpression(unwrap(tagsProp.initializer));
  }

  /**
   * Resolve a literal or helper-computed title.
   * @param {import('typescript').Expression | undefined} node
   * @param {Map<string, unknown>} env
   * @returns {string | undefined}
   */
  function evalTitle(node, env) {
    const value = evalExpr(node, env);
    return typeof value === 'string' ? value.trim() : undefined;
  }

  /** @type {ExecutableTest[]} */
  const tests = [];

  /**
   * Traverse spec declarations and nested test factories.
   * @param {import('typescript').Node | undefined} node
   * @param {{ suites: string[], tags: string[] }} ctx
   * @param {Map<string, unknown>} env
   * @returns {void}
   */
  function visit(node, ctx, env) {
    node = unwrap(node);
    if (!node) return;

    if (ts.isSourceFile(node) || ts.isBlock(node)) {
      for (const statement of node.statements) visit(statement, ctx, env);
      return;
    }

    if (ts.isExpressionStatement(node)) {
      visit(node.expression, ctx, env);
      return;
    }

    if (ts.isIfStatement(node)) {
      visit(node.thenStatement, ctx, env);
      if (node.elseStatement) visit(node.elseStatement, ctx, env);
      return;
    }

    if (!ts.isCallExpression(node)) return;

    if (isCallNamed(node.expression, ['describe', 'context'])) {
      const title = evalTitle(node.arguments[0], env);
      const maybeConfig = node.arguments.length >= 3 ? unwrap(node.arguments[1]) : undefined;
      const config = maybeConfig && ts.isObjectLiteralExpression(maybeConfig) ? maybeConfig : undefined;
      const callback = unwrap(node.arguments[node.arguments.length - 1]);
      const suiteTags = extractTags(config, env);
      const nextCtx = {
        suites: title ? [...ctx.suites, title] : [...ctx.suites],
        tags: uniq([...ctx.tags, ...suiteTags]),
      };

      if (callback && (ts.isArrowFunction(callback) || ts.isFunctionExpression(callback))) {
        visit(callback.body, nextCtx, env);
      }
      return;
    }

    if (isCallNamed(node.expression, ['it', 'test', 'specify'])) {
      const title = evalTitle(node.arguments[0], env);
      if (!title) return;

      const maybeConfig = node.arguments.length >= 3 ? unwrap(node.arguments[1]) : undefined;
      const config = maybeConfig && ts.isObjectLiteralExpression(maybeConfig) ? maybeConfig : undefined;
      const ownTags = extractTags(config, env);
      const tagsProp = findTagsProperty(config);
      const tagArrayNode = tagsProp && ts.isPropertyAssignment(tagsProp) ? unwrap(tagsProp.initializer) : undefined;
      const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;

      tests.push({
        scope: 'component',
        file: rel(file),
        line,
        title,
        qualifiedTitle: [...ctx.suites, title].join(' > '),
        tags: uniq([...ctx.tags, ...ownTags]),
        autoPotWritable: isAutoPotWritableTest(node),
        tagEdit:
          tagArrayNode && ts.isArrayLiteralExpression(tagArrayNode)
            ? {
                kind: 'component_inline_array',
                start: tagArrayNode.getStart(sourceFile),
                end: tagArrayNode.getEnd(),
              }
            : undefined,
      });
      return;
    }

    const callee = unwrap(node.expression);
    if (ts.isIdentifier(callee) && fnContainsSpec(callee.text)) {
      const fn = functionDefs.get(callee.text);
      visit(getFnBody(fn), ctx, bindArgs(fn, node.arguments, env));
    }
  }

  visit(sourceFile, { suites: [], tags: [] }, new Map());
  return tests;
}

/**
 * Analyse executable tests for missing tags and duplicate names.
 * @param {ExecutableTest[]} tests
 * @returns {{
 *   total: number,
 *   missingStory: ExecutableTest[],
 *   missingPot: ExecutableTest[],
 *   autoPotIncompatible: ExecutableTest[],
 *   multiplePot: Array<ExecutableTest & { potTags: string[] }>,
 *   sharedPot: Array<{ key: string, tests: ExecutableTest[] }>,
 *   duplicateTitle: Array<{ key: string, tests: ExecutableTest[] }>,
 *   duplicateQualifiedTitle: Array<{ key: string, tests: ExecutableTest[] }>
 * }}
 */
function analyse(tests) {
  const missingStory = [];
  const missingPot = [];
  const autoPotIncompatible = [];
  const multiplePot = [];
  const testsByPot = new Map();
  const testsByTitle = new Map();
  const testsByQualifiedTitle = new Map();

  for (const test of tests) {
    const storyTags = test.tags.filter((tag) => STORY_TAG_RE.test(tag));
    const potTags = test.tags.filter((tag) => POT_TAG_RE.test(tag));

    if (storyTags.length === 0) missingStory.push(test);
    if (potTags.length === 0) missingPot.push(test);
    if (test.scope === 'component' && test.autoPotWritable === false) autoPotIncompatible.push(test);
    if (potTags.length > 1) multiplePot.push({ ...test, potTags });

    for (const potTag of potTags) {
      if (!testsByPot.has(potTag)) testsByPot.set(potTag, []);
      testsByPot.get(potTag).push(test);
    }

    if (!testsByTitle.has(test.title)) testsByTitle.set(test.title, []);
    testsByTitle.get(test.title).push(test);

    if (!testsByQualifiedTitle.has(test.qualifiedTitle)) testsByQualifiedTitle.set(test.qualifiedTitle, []);
    testsByQualifiedTitle.get(test.qualifiedTitle).push(test);
  }

  return {
    total: tests.length,
    missingStory,
    missingPot,
    autoPotIncompatible,
    multiplePot,
    sharedPot: [...testsByPot.entries()]
      .filter(([, group]) => group.length > 1)
      .map(([key, groupedTests]) => ({ key, tests: groupedTests })),
    duplicateTitle: [...testsByTitle.entries()]
      .filter(([, group]) => group.length > 1)
      .map(([key, groupedTests]) => ({ key, tests: groupedTests })),
    duplicateQualifiedTitle: [...testsByQualifiedTitle.entries()]
      .filter(([, group]) => group.length > 1)
      .map(([key, groupedTests]) => ({ key, tests: groupedTests })),
  };
}

/**
 * Create one CSV row per offending test occurrence.
 * @param {"missing_story"|"missing_pot"|"auto_pot_incompatible_tags"|"multiple_pot"|"shared_pot"|"duplicate_title"|"duplicate_qualified_title"} issueType
 * @param {ExecutableTest[]} tests
 * @param {{ key?: string, relatedTests?: ExecutableTest[], potTagsByTest?: Map<string, string[]> }} options
 * @returns {CsvRow[]}
 */
function buildIssueRows(issueType, tests, options = {}) {
  const relatedLocations = (options.relatedTests || []).map((test) => `${test.file}:${test.line}`);
  const relatedTests = (options.relatedTests || []).map((test) => `${test.qualifiedTitle} [${test.file}:${test.line}]`);
  const relatedCount = options.relatedTests ? options.relatedTests.length : '';

  return tests.map((test) => {
    const storyTags = test.tags.filter((tag) => STORY_TAG_RE.test(tag));
    const potTags =
      options.potTagsByTest?.get(`${test.file}:${test.line}:${test.qualifiedTitle}`) ||
      test.tags.filter((tag) => POT_TAG_RE.test(tag));

    return {
      scope: test.scope,
      issue_type: issueType,
      file: test.file,
      line: test.line,
      title: test.title,
      qualified_title: test.qualifiedTitle,
      story_tags: storyTags.join(' | '),
      pot_tags: potTags.join(' | '),
      auto_pot_writable: test.autoPotWritable === undefined ? '' : test.autoPotWritable ? 'true' : 'false',
      group_key: options.key || '',
      related_count: relatedCount,
      related_locations: relatedLocations.join(' | '),
      related_tests: relatedTests.join(' | '),
    };
  });
}

/**
 * Build all CSV rows for an analysed scope.
 * @param {ReturnType<typeof analyse>} result
 * @returns {CsvRow[]}
 */
function buildRows(result) {
  const rows = [];

  rows.push(...buildIssueRows('missing_story', result.missingStory));
  rows.push(...buildIssueRows('missing_pot', result.missingPot));
  rows.push(...buildIssueRows('auto_pot_incompatible_tags', result.autoPotIncompatible));

  if (result.multiplePot.length > 0) {
    const potTagsByTest = new Map(
      result.multiplePot.map((test) => [`${test.file}:${test.line}:${test.qualifiedTitle}`, test.potTags]),
    );
    rows.push(...buildIssueRows('multiple_pot', result.multiplePot, { potTagsByTest }));
  }

  for (const group of result.sharedPot) {
    rows.push(...buildIssueRows('shared_pot', group.tests, { key: group.key, relatedTests: group.tests }));
  }

  for (const group of result.duplicateTitle) {
    rows.push(...buildIssueRows('duplicate_title', group.tests, { key: group.key, relatedTests: group.tests }));
  }

  for (const group of result.duplicateQualifiedTitle) {
    rows.push(
      ...buildIssueRows('duplicate_qualified_title', group.tests, { key: group.key, relatedTests: group.tests }),
    );
  }

  return rows.sort((a, b) => {
    return (
      String(a.scope).localeCompare(String(b.scope)) ||
      String(a.issue_type).localeCompare(String(b.issue_type)) ||
      String(a.file).localeCompare(String(b.file)) ||
      Number(a.line) - Number(b.line) ||
      String(a.qualified_title).localeCompare(String(b.qualified_title))
    );
  });
}

/**
 * Print a concise summary.
 * @param {string} outputPath
 * @param {ReturnType<typeof analyse>} component
 * @param {ReturnType<typeof analyse>} functional
 * @param {number} rowCount
 * @returns {void}
 */
function printSummary(outputPath, component, functional, rowCount) {
  console.log(`[check-cypress-test-metadata] wrote ${rel(outputPath)}`);
  console.log(
    `[check-cypress-test-metadata] component total=${component.total} missing_story=${component.missingStory.length} missing_pot=${component.missingPot.length} auto_pot_incompatible=${component.autoPotIncompatible.length} multiple_pot=${component.multiplePot.length} shared_pot=${component.sharedPot.length} duplicate_title=${component.duplicateTitle.length} duplicate_qualified_title=${component.duplicateQualifiedTitle.length}`,
  );
  console.log(
    `[check-cypress-test-metadata] functional total=${functional.total} missing_story=${functional.missingStory.length} missing_pot=${functional.missingPot.length} auto_pot_incompatible=${functional.autoPotIncompatible.length} multiple_pot=${functional.multiplePot.length} shared_pot=${functional.sharedPot.length} duplicate_title=${functional.duplicateTitle.length} duplicate_qualified_title=${functional.duplicateQualifiedTitle.length}`,
  );
  console.log(`[check-cypress-test-metadata] csv_rows=${rowCount}`);
}

function collectExecutableTests() {
  const componentTests = walk(COMPONENT_ROOT, '.cy.ts')
    .flatMap(extractComponentTests)
    .filter((test) => !shouldIgnoreTest(test));
  const functionalTests = walk(FUNCTIONAL_ROOT, '.feature')
    .flatMap(extractFunctionalTests)
    .filter((test) => !shouldIgnoreTest(test));

  return {
    componentTests,
    functionalTests,
    allTests: [...componentTests, ...functionalTests],
  };
}

function main() {
  const outputPath = resolveOutputPath();
  const { componentTests, functionalTests } = collectExecutableTests();
  const componentResult = analyse(componentTests);
  const functionalResult = analyse(functionalTests);
  const rows = [...buildRows(componentResult), ...buildRows(functionalResult)];

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const headers = [
    'scope',
    'issue_type',
    'file',
    'line',
    'title',
    'qualified_title',
    'story_tags',
    'pot_tags',
    'auto_pot_writable',
    'group_key',
    'related_count',
    'related_locations',
    'related_tests',
  ];

  fs.writeFileSync(outputPath, toCsv(rows, headers), 'utf8');
  printSummary(outputPath, componentResult, functionalResult, rows.length);

  process.exit(rows.length === 0 ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = {
  ROOT,
  COMPONENT_ROOT,
  FUNCTIONAL_ROOT,
  walk,
  rel,
  shouldIgnoreTest,
  extractComponentTests,
  extractFunctionalTests,
  analyse,
  buildRows,
  toCsv,
  collectExecutableTests,
};

/**
 * @typedef {{
 *   scope: "component" | "functional",
 *   file: string,
 *   line: number,
 *   title: string,
 *   qualifiedTitle: string,
 *   tags: string[],
 *   autoPotWritable?: boolean,
 *   tagEdit?: {
 *     kind: "component_inline_array",
 *     start: number,
 *     end: number
 *   } | {
 *     kind: "functional_gherkin_block",
 *     anchorLine: number
 *   }
 * }} ExecutableTest
 */

/**
 * @typedef {{
 *   scope: string,
 *   issue_type: string,
 *   file: string,
 *   line: number,
 *   title: string,
 *   qualified_title: string,
 *   story_tags: string,
 *   pot_tags: string,
 *   auto_pot_writable: string,
 *   group_key: string,
 *   related_count: string | number,
 *   related_locations: string,
 *   related_tests: string
 * }} CsvRow
 */
