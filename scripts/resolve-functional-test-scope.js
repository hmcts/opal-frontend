#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = process.cwd();
const DEFAULT_MAP_PATH = 'config/test-impact-map.json';

/**
 * Normalize a path string to POSIX separators and strip a leading "./".
 * @param {string} p Raw path.
 * @returns {string} Normalized relative path.
 */
function toPosix(p) {
  const normalized = p.replaceAll('\\', '/');
  return normalized.startsWith('./') ? normalized.slice(2) : normalized;
}

/**
 * Parse CLI arguments into resolver options.
 * @param {string[]} argv Process argv slice.
 * @returns {{
 *   base: string,
 *   head: string,
 *   mode: string,
 *   map: string,
 *   writeEnv: string,
 *   forceFullFunctional: string,
 *   forceFullFunctionalLabel: string
 * }} Parsed options.
 */
function parseArgs(argv) {
  const args = {
    base: 'origin/master',
    head: 'HEAD',
    mode: 'observe',
    map: DEFAULT_MAP_PATH,
    writeEnv: '',
    forceFullFunctional: 'false',
    forceFullFunctionalLabel: 'false',
  };

  const optionMap = {
    '--base': 'base',
    '--head': 'head',
    '--mode': 'mode',
    '--map': 'map',
    '--write-env': 'writeEnv',
    '--force-full-functional': 'forceFullFunctional',
    '--force-full-functional-label': 'forceFullFunctionalLabel',
  };

  const queue = [...argv];
  while (queue.length > 0) {
    const key = queue.shift();
    const targetField = optionMap[key];
    if (!targetField || queue.length === 0) {
      continue;
    }
    args[targetField] = queue.shift();
  }

  return args;
}

/**
 * Convert string-like values to booleans.
 * @param {unknown} v Value to parse.
 * @returns {boolean} True if value is "true" (case-insensitive).
 */
function toBool(v) {
  return String(v).trim().toLowerCase() === 'true';
}

/**
 * Run a rename-aware git diff and return name-status output.
 * @param {string} base Base git ref.
 * @param {string} head Head git ref.
 * @returns {string} Raw `git diff --name-status` output.
 */
function runGitNameStatus(base, head) {
  const range = `${base}...${head}`;
  const result = spawnSync('git', ['diff', '--name-status', range], {
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.status !== 0) {
    throw new Error(`git diff failed for range ${range}: ${result.stderr || 'unknown error'}`);
  }

  return result.stdout;
}

/**
 * Parse `git diff --name-status` output into changed path metadata.
 * Includes both old and new paths for renames/copies.
 * @param {string} output Raw name-status output.
 * @returns {{changedFiles: string[], entries: Array<object>}} Parsed result.
 */
function parseNameStatus(output) {
  const changed = new Set();
  const entries = [];

  const lines = output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    const parts = line.split(/\s+/);
    const status = parts[0];

    if (status.startsWith('R') || status.startsWith('C')) {
      const from = toPosix(parts[1] || '');
      const to = toPosix(parts[2] || '');
      if (from) {
        changed.add(from);
      }
      if (to) {
        changed.add(to);
      }
      entries.push({ status, from, to });
      continue;
    }

    const file = toPosix(parts[1] || '');
    if (file) {
      changed.add(file);
    }
    entries.push({ status, file });
  }

  return {
    changedFiles: Array.from(changed),
    entries,
  };
}

/**
 * Check whether file starts with any provided prefix.
 * @param {string} file File path.
 * @param {string[]} prefixes Prefix list.
 * @returns {boolean} True if any prefix matches.
 */
function startsWithAny(file, prefixes) {
  return prefixes.some((prefix) => file.startsWith(prefix));
}

/**
 * Determine whether a file is docs-only according to mapping rules.
 * @param {string} file File path.
 * @param {Record<string, any>} map Resolver map configuration.
 * @returns {boolean} True when file is documentation-only.
 */
function isDocsOnlyFile(file, map) {
  if (startsWithAny(file, map.docsPrefixes || [])) {
    return true;
  }

  return (map.docsExtensions || []).some((ext) => file.endsWith(ext));
}

/**
 * Load and parse the resolver impact-map JSON.
 * @param {string} mapPath Repository-relative map file path.
 * @returns {Record<string, any>} Parsed map object.
 */
function loadMap(mapPath) {
  const content = fs.readFileSync(path.resolve(ROOT, mapPath), 'utf-8');
  return JSON.parse(content);
}

/**
 * Normalize a path/token string for fuzzy domain matching.
 * @param {string} file Source value.
 * @returns {string} Lowercased alphanumeric token.
 */
function sanitizeToken(file) {
  return file.toLowerCase().replaceAll(/[^a-z0-9]/g, '');
}

/**
 * Check whether a file maps to a domain via prefix or token matching.
 * @param {Record<string, any>} domain Domain mapping rule.
 * @param {string} file File path.
 * @returns {boolean} True if file belongs to the domain.
 */
function domainMatchesFile(domain, file) {
  if (startsWithAny(file, domain.appPrefixes || [])) {
    return true;
  }

  const token = sanitizeToken(file);
  return (domain.cypressTokens || []).some((needle) => token.includes(sanitizeToken(needle)));
}

/**
 * Check whether a file belongs to a global-risk path that forces full execution.
 * @param {Record<string, any>} map Resolver map configuration.
 * @param {string} file File path.
 * @returns {boolean} True when full-suite fallback should apply.
 */
function shouldForceFull(map, file) {
  return (map.globalRiskPaths || []).some((rule) => file === rule || file.startsWith(rule));
}

/**
 * Deduplicate and sort string values.
 * @param {string[]} values Input values.
 * @returns {string[]} Unique, sorted values.
 */
function uniqueSorted(values) {
  return Array.from(new Set(values)).sort();
}

/**
 * Discover all TypeScript files under the Cypress tree.
 * @returns {string[]} Repository-relative TS file list.
 */
function discoverCypressTsFiles() {
  const root = path.resolve(ROOT, 'cypress');
  const files = [];

  function walk(dir) {
    const dirents = fs.readdirSync(dir, { withFileTypes: true });
    for (const dirent of dirents) {
      const abs = path.join(dir, dirent.name);
      if (dirent.isDirectory()) {
        walk(abs);
        continue;
      }
      if (dirent.name.endsWith('.ts')) {
        files.push(toPosix(path.relative(ROOT, abs)));
      }
    }
  }

  if (fs.existsSync(root)) {
    walk(root);
  }

  return files;
}

/**
 * Extract static import/require specifiers from source code.
 * @param {string} source File contents.
 * @returns {string[]} Import specifiers.
 */
function extractImportSpecifiers(source) {
  const specifiers = new Set();
  const importExportRe = /(?:import|export)\s+(?:[^'";]+?\s+from\s+)?['"]([^'"\n]+)['"]/g;
  const requireRe = /require\(['"]([^'"\n]+)['"]\)/g;

  let m = importExportRe.exec(source);
  while (m) {
    specifiers.add(m[1]);
    m = importExportRe.exec(source);
  }

  m = requireRe.exec(source);
  while (m) {
    specifiers.add(m[1]);
    m = requireRe.exec(source);
  }

  return Array.from(specifiers);
}

/**
 * Resolve relative import specifier to a repository-relative file path.
 * @param {string} fromFile Importer file path.
 * @param {string} specifier Relative import specifier.
 * @returns {string} Resolved file path or empty string when unresolved.
 */
function resolveRelativeImport(fromFile, specifier) {
  if (!specifier.startsWith('.')) {
    return '';
  }

  const fromDir = path.dirname(path.resolve(ROOT, fromFile));
  const base = path.resolve(fromDir, specifier);
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    path.join(base, 'index.ts'),
    path.join(base, 'index.js'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return toPosix(path.relative(ROOT, candidate));
    }
  }

  return '';
}

/**
 * Build reverse dependency graph for Cypress TS files.
 * Key is imported file; value is set of importing files.
 * @returns {Map<string, Set<string>>} Reverse dependency graph.
 */
function buildReverseDependencyGraph() {
  const tsFiles = discoverCypressTsFiles();
  const reverse = new Map();

  for (const file of tsFiles) {
    const abs = path.resolve(ROOT, file);
    const source = fs.readFileSync(abs, 'utf-8');
    const imports = extractImportSpecifiers(source);

    for (const specifier of imports) {
      const resolved = resolveRelativeImport(file, specifier);
      if (!resolved) {
        continue;
      }
      if (!reverse.has(resolved)) {
        reverse.set(resolved, new Set());
      }
      reverse.get(resolved).add(file);
    }
  }

  return reverse;
}

/**
 * Collect transitive dependents from a reverse dependency graph.
 * @param {Map<string, Set<string>>} reverseGraph Reverse dependency graph.
 * @param {string[]} startFiles Initial files.
 * @returns {string[]} All reachable dependents including start files.
 */
function collectDependents(reverseGraph, startFiles) {
  const queue = [...startFiles];
  const seen = new Set(startFiles);

  while (queue.length > 0) {
    const current = queue.shift();
    const dependents = reverseGraph.get(current);
    if (!dependents) {
      continue;
    }

    for (const dep of dependents) {
      if (seen.has(dep)) {
        continue;
      }
      seen.add(dep);
      queue.push(dep);
    }
  }

  return Array.from(seen);
}

/**
 * Add directly matched domains for a single file.
 * @param {Record<string, any>[]} domains Domain rules.
 * @param {string} file File path.
 * @param {Set<string>} matchedDomains Accumulator.
 * @returns {boolean} True when any domain matched.
 */
function collectDirectDomainMatches(domains, file, matchedDomains) {
  let matched = false;
  for (const domain of domains) {
    if (!domainMatchesFile(domain, file)) {
      continue;
    }
    matchedDomains.add(domain.name);
    matched = true;
  }
  return matched;
}

/**
 * Add domains matched by transitive Cypress dependencies.
 * @param {Record<string, any>} map Resolver map configuration.
 * @param {Map<string, Set<string>>} reverseGraph Reverse dependency graph.
 * @param {string} file Changed file path.
 * @param {Set<string>} matchedDomains Accumulator.
 * @returns {boolean} True when any dependent domain matched.
 */
function collectDependentDomainMatches(map, reverseGraph, file, matchedDomains) {
  const domains = map.domains || [];
  const dependents = collectDependents(reverseGraph, [file]);
  let matched = false;
  for (const dep of dependents) {
    if (collectDirectDomainMatches(domains, dep, matchedDomains)) {
      matched = true;
    }
  }
  return matched;
}

/**
 * Map changed files to domains, unresolved files, and force-full reasons.
 * @param {Record<string, any>} map Resolver map configuration.
 * @param {string[]} changedFiles Changed file list.
 * @returns {{matchedDomains: string[], unresolved: string[], fullReasons: string[]}} Mapping result.
 */
function mapChangedFilesToDomains(map, changedFiles) {
  const matchedDomains = new Set();
  const unresolved = [];
  const fullReasons = [];
  const domains = map.domains || [];
  const reverseGraph = buildReverseDependencyGraph();

  for (const file of changedFiles) {
    if (shouldForceFull(map, file)) {
      fullReasons.push(`global-risk:${file}`);
      continue;
    }

    if (isDocsOnlyFile(file, map)) {
      continue;
    }

    let matched = collectDirectDomainMatches(domains, file, matchedDomains);
    if (!matched && startsWithAny(file, map.dependencyMappedPrefixes || [])) {
      matched = collectDependentDomainMatches(map, reverseGraph, file, matchedDomains);
    }

    if (!matched) {
      unresolved.push(file);
    }
  }

  return {
    matchedDomains: Array.from(matchedDomains),
    unresolved,
    fullReasons,
  };
}

/**
 * Resolve manual label-based functional spec overrides.
 * @param {Record<string, any>} map Resolver map configuration.
 * @param {string[]} labels Project labels.
 * @returns {string[]} Functional spec globs requested by labels.
 */
function resolveManualSpecOverride(map, labels) {
  const manualSpecs = [];
  const table = map.manualLabelToFunctionalSpec || {};
  for (const label of labels) {
    if (table[label]) {
      manualSpecs.push(table[label]);
    }
  }
  return uniqueSorted(manualSpecs);
}

/**
 * Build proposed functional/component spec lists from matched domains.
 * @param {Record<string, any>} map Resolver map configuration.
 * @param {string[]} matchedDomainNames Matched domain names.
 * @returns {{functionalSpecs: string[], componentSpecs: string[]}} Proposed specs.
 */
function collectSpecsFromMatchedDomains(map, matchedDomainNames) {
  const domainTable = new Map((map.domains || []).map((domain) => [domain.name, domain]));
  const functionalSpecs = [];
  const componentSpecs = [];

  for (const domainName of matchedDomainNames) {
    const domain = domainTable.get(domainName);
    if (!domain) {
      continue;
    }
    if (domain.functionalSpec) {
      functionalSpecs.push(domain.functionalSpec);
    }
    if (domain.componentSpec) {
      componentSpecs.push(domain.componentSpec);
    }
  }

  return { functionalSpecs, componentSpecs };
}

/**
 * Compute confidence metrics used for fallback decisions.
 * @param {Record<string, any>} map Resolver map configuration.
 * @param {string[]} changedFiles Changed file list.
 * @param {string[]} unresolvedPaths Unresolved file list.
 * @returns {{
 *   changedCount: number,
 *   resolvedCount: number,
 *   confidence: number,
 *   belowThreshold: boolean,
 *   tooManyUnresolved: boolean
 * }} Confidence info.
 */
function getConfidenceInfo(map, changedFiles, unresolvedPaths) {
  const changedCount = changedFiles.length;
  const unresolvedCount = unresolvedPaths.length;
  const resolvedCount = Math.max(0, changedCount - unresolvedCount);
  const confidence = changedCount === 0 ? 1 : resolvedCount / changedCount;
  const belowThreshold = confidence < Number(map.confidenceThreshold || 0.9);
  const tooManyUnresolved = unresolvedCount > Number(map.maxUnresolved || 2);
  return { changedCount, resolvedCount, confidence, belowThreshold, tooManyUnresolved };
}

/**
 * Apply targeted spec selection to a mutable proposal object.
 * @param {string[]} functionalSpecs Functional spec candidates.
 * @param {string[]} componentSpecs Component spec candidates.
 * @param {{proposedRunFunctional: boolean, proposedRunComponent: boolean, proposedFunctionalSpec: string, proposedComponentSpec: string}} proposal Mutable proposal.
 * @param {string[]} reasons Decision reason accumulator.
 * @returns {void}
 */
function applyTargetedSelection(functionalSpecs, componentSpecs, proposal, reasons) {
  if (functionalSpecs.length > 0) {
    proposal.proposedFunctionalSpec = uniqueSorted(functionalSpecs).join(',');
    reasons.push(`targeted-functional:${proposal.proposedFunctionalSpec}`);
  } else {
    proposal.proposedRunFunctional = false;
    reasons.push('no-functional-impact');
  }

  if (componentSpecs.length > 0) {
    proposal.proposedComponentSpec = uniqueSorted(componentSpecs).join(',');
    reasons.push(`targeted-component:${proposal.proposedComponentSpec}`);
  } else {
    proposal.proposedRunComponent = false;
    reasons.push('no-component-impact');
  }
}

/**
 * Resolve effective and proposed test scope for a change set.
 * @param {{
 *   map: Record<string, any>,
 *   changedFiles: string[],
 *   mode: string,
 *   labels: string[],
 *   forceFullFunctionalEnv: boolean,
 *   forceFullFunctionalLabel: boolean
 * }} params Scope resolution input.
 * @returns {Record<string, any>} Scope decision output.
 */
function resolveScopeForChanges(params) {
  const { map, changedFiles, mode, labels, forceFullFunctionalEnv, forceFullFunctionalLabel } = params;
  const hasChanges = changedFiles.length > 0;
  const docsOnly = hasChanges && changedFiles.every((file) => isDocsOnlyFile(file, map));
  const manualSpecs = resolveManualSpecOverride(map, labels);
  const mapping = mapChangedFilesToDomains(map, changedFiles);
  const { functionalSpecs, componentSpecs } = collectSpecsFromMatchedDomains(map, mapping.matchedDomains);
  if (manualSpecs.length > 0) {
    functionalSpecs.splice(0, functionalSpecs.length, ...manualSpecs);
  }

  const confidenceInfo = getConfidenceInfo(map, changedFiles, mapping.unresolved);
  const forceFull = forceFullFunctionalEnv || forceFullFunctionalLabel;
  const hasGlobalRisk = mapping.fullReasons.length > 0;

  const proposal = {
    proposedRunFunctional: true,
    proposedRunComponent: true,
    proposedFunctionalSpec: map.fullFunctionalSpec,
    proposedComponentSpec: map.fullComponentSpec,
  };
  const reasons = [];

  if (!hasChanges) {
    reasons.push('no-changes-detected');
  }

  if (docsOnly) {
    proposal.proposedRunFunctional = false;
    proposal.proposedRunComponent = false;
    reasons.push('docs-only-change');
  } else if (forceFull) {
    reasons.push('force-full-functional-override');
  } else if (hasGlobalRisk) {
    reasons.push(`global-risk-files:${mapping.fullReasons.join(',')}`);
  } else if (confidenceInfo.belowThreshold || confidenceInfo.tooManyUnresolved) {
    reasons.push('fallback-full-due-to-confidence');
  } else {
    applyTargetedSelection(functionalSpecs, componentSpecs, proposal, reasons);
  }

  let runFunctional = proposal.proposedRunFunctional;
  let runComponent = proposal.proposedRunComponent;
  let functionalSpec = proposal.proposedFunctionalSpec;
  let componentSpec = proposal.proposedComponentSpec;

  if (mode === 'observe') {
    runFunctional = true;
    runComponent = true;
    functionalSpec = map.fullFunctionalSpec;
    componentSpec = map.fullComponentSpec;
    reasons.push('observe-mode-full-execution');
  }

  return {
    runFunctional,
    runComponent,
    testSpecs: functionalSpec,
    componentSpecs: componentSpec,
    proposedRunFunctional: proposal.proposedRunFunctional,
    proposedRunComponent: proposal.proposedRunComponent,
    proposedTestSpecs: proposal.proposedFunctionalSpec,
    proposedComponentSpecs: proposal.proposedComponentSpec,
    reason: reasons.join(';'),
    matchedDomains: uniqueSorted(mapping.matchedDomains),
    unresolvedPaths: uniqueSorted(mapping.unresolved),
    resolvedCount: confidenceInfo.resolvedCount,
    changedCount: confidenceInfo.changedCount,
    confidence: confidenceInfo.confidence,
    forceFullFunctionalEnv,
    forceFullFunctionalLabel,
    mode,
  };
}

/**
 * Write resolver output as shell-compatible key=value lines.
 * @param {string} filePath Output env file path.
 * @param {Record<string, any>} scope Scope output object.
 * @returns {void}
 */
function writeEnvFile(filePath, scope) {
  const lines = [
    `RUN_FUNCTIONAL=${scope.runFunctional}`,
    `RUN_COMPONENT=${scope.runComponent}`,
    `TEST_SPECS=${scope.testSpecs}`,
    `COMPONENT_SPECS=${scope.componentSpecs}`,
    `PROPOSED_RUN_FUNCTIONAL=${scope.proposedRunFunctional}`,
    `PROPOSED_RUN_COMPONENT=${scope.proposedRunComponent}`,
    `PROPOSED_TEST_SPECS=${scope.proposedTestSpecs}`,
    `PROPOSED_COMPONENT_SPECS=${scope.proposedComponentSpecs}`,
    `SCOPE_REASON=${scope.reason}`,
    `MATCHED_DOMAINS=${scope.matchedDomains.join(',')}`,
    `UNRESOLVED_PATHS=${scope.unresolvedPaths.join(',')}`,
    `RESOLVED_COUNT=${scope.resolvedCount}`,
    `CHANGED_COUNT=${scope.changedCount}`,
    `CONFIDENCE=${scope.confidence.toFixed(3)}`,
    `FORCE_FULL_FUNCTIONAL_ENV=${scope.forceFullFunctionalEnv}`,
    `FORCE_FULL_FUNCTIONAL_LABEL=${scope.forceFullFunctionalLabel}`,
    `CHANGE_AWARE_MODE=${scope.mode}`,
  ];

  const abs = path.resolve(ROOT, filePath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, `${lines.join('\n')}\n`, 'utf-8');
}

/**
 * CLI entry point for resolver execution.
 * @returns {void}
 */
function main() {
  const args = parseArgs(process.argv.slice(2));
  const map = loadMap(args.map);
  const mode = ['observe', 'enforce'].includes(args.mode) ? args.mode : 'observe';

  const diff = runGitNameStatus(args.base, args.head);
  const parsed = parseNameStatus(diff);

  const labels = (process.env.PROJECT_LABELS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const scope = resolveScopeForChanges({
    map,
    changedFiles: parsed.changedFiles,
    mode,
    labels,
    forceFullFunctionalEnv: toBool(args.forceFullFunctional),
    forceFullFunctionalLabel: toBool(args.forceFullFunctionalLabel),
  });

  if (args.writeEnv) {
    writeEnvFile(args.writeEnv, scope);
  }

  console.log(`Changed files: ${scope.changedCount}`);
  console.log(`Selection mode: ${scope.mode}`);
  console.log(`Functional run (effective): ${scope.runFunctional}`);
  console.log(`Component run (effective): ${scope.runComponent}`);
  console.log(`Functional specs (effective): ${scope.testSpecs}`);
  console.log(`Component specs (effective): ${scope.componentSpecs}`);
  console.log(`Functional specs (proposed): ${scope.proposedTestSpecs}`);
  console.log(`Component specs (proposed): ${scope.proposedComponentSpecs}`);
  console.log(`Matched domains: ${scope.matchedDomains.join(',') || 'none'}`);
  console.log(`Unresolved paths: ${scope.unresolvedPaths.join(',') || 'none'}`);
  console.log(`Confidence: ${scope.confidence.toFixed(3)} (${scope.resolvedCount}/${scope.changedCount})`);
  console.log(`Reason: ${scope.reason}`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

module.exports = {
  parseArgs,
  parseNameStatus,
  resolveScopeForChanges,
  mapChangedFilesToDomains,
  writeEnvFile,
};
