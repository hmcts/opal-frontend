'use strict';

const { describe, expect, it } = require('vitest');
const { parseNameStatus, resolveScopeForChanges } = require('./resolve-functional-test-scope');
const impactMap = require('../config/test-impact-map.json');

describe('resolve-functional-test-scope', () => {
  it('parses rename entries as old and new changed paths', () => {
    const parsed = parseNameStatus('R100\tsrc/a.ts\tsrc/b.ts\nM\tsrc/c.ts\n');
    expect(parsed.changedFiles).toContain('src/a.ts');
    expect(parsed.changedFiles).toContain('src/b.ts');
    expect(parsed.changedFiles).toContain('src/c.ts');
  });

  it('targets manual account creation domain for fines-mac changes in enforce mode', () => {
    const scope = resolveScopeForChanges({
      map: impactMap,
      changedFiles: ['src/app/flows/fines/fines-mac/fines-mac-create-account/fines-mac-create-account.component.ts'],
      mode: 'enforce',
      labels: [],
      forceFullFunctionalEnv: false,
      forceFullFunctionalLabel: false,
    });

    expect(scope.runFunctional).toBe(true);
    expect(scope.runComponent).toBe(true);
    expect(scope.testSpecs).toContain('manualAccountCreation');
    expect(scope.componentSpecs).toContain('manualAccountCreation');
    expect(scope.confidence).toBe(1);
  });

  it('skips functional and component for docs-only changes in enforce mode', () => {
    const scope = resolveScopeForChanges({
      map: impactMap,
      changedFiles: ['docs/CYPRESS_E2E_TESTING.md', 'plans/change_aware_cypress_exec.md'],
      mode: 'enforce',
      labels: [],
      forceFullFunctionalEnv: false,
      forceFullFunctionalLabel: false,
    });

    expect(scope.runFunctional).toBe(false);
    expect(scope.runComponent).toBe(false);
  });

  it('forces full functional with force_full_functional label override', () => {
    const scope = resolveScopeForChanges({
      map: impactMap,
      changedFiles: ['docs/CYPRESS_E2E_TESTING.md'],
      mode: 'enforce',
      labels: ['force_full_functional'],
      forceFullFunctionalEnv: false,
      forceFullFunctionalLabel: true,
    });

    expect(scope.runFunctional).toBe(true);
    expect(scope.testSpecs).toBe(impactMap.fullFunctionalSpec);
  });

  it('keeps full execution in observe mode while preserving proposed targeted specs', () => {
    const scope = resolveScopeForChanges({
      map: impactMap,
      changedFiles: ['src/app/flows/fines/fines-con/select-business-unit/select-business-unit.component.ts'],
      mode: 'observe',
      labels: [],
      forceFullFunctionalEnv: false,
      forceFullFunctionalLabel: false,
    });

    expect(scope.runFunctional).toBe(true);
    expect(scope.runComponent).toBe(true);
    expect(scope.testSpecs).toBe(impactMap.fullFunctionalSpec);
    expect(scope.componentSpecs).toBe(impactMap.fullComponentSpec);
    expect(scope.proposedTestSpecs).toContain('consolidation');
    expect(scope.proposedComponentSpecs).toContain('consolidation');
  });

  it('falls back to full suites when confidence is below threshold', () => {
    const scope = resolveScopeForChanges({
      map: impactMap,
      changedFiles: ['src/app/flows/fines/fines-mac/example.ts', 'unknown/new/path/file.ts'],
      mode: 'enforce',
      labels: [],
      forceFullFunctionalEnv: false,
      forceFullFunctionalLabel: false,
    });

    expect(scope.runFunctional).toBe(true);
    expect(scope.runComponent).toBe(true);
    expect(scope.testSpecs).toBe(impactMap.fullFunctionalSpec);
    expect(scope.reason).toContain('fallback-full-due-to-confidence');
  });
});
