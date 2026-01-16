// cypress/support/e2e.ts

// ***********************************************************
// This support file is processed and loaded automatically
// before your test files.
//
// Great place for global configuration / behaviour.
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
import {
  getCurrentScenarioStartedAt,
  getCurrentScenarioTitle,
  setCurrentScenarioFinishedAt,
  setCurrentScenarioFeaturePath,
  setCurrentScenarioTitle,
} from './utils/scenarioContext';

// Simple marker so we can confirm in CI logs this file is actually loaded

console.log('*** Cypress e2e support file loaded ***');

// When running in Cypress open mode, reset evidence at the start of a spec run so only the latest
// run's JSON/screenshots are kept if the runner "refresh" button is used.
before(() => {
  if (!Cypress.config('isInteractive')) {
    return;
  }
  cy.task('accountCapture:resetEvidence', undefined, { log: false });
});

// Capture the current scenario title and reset the per-scenario `{uniq}` suffix.
beforeEach(function () {
  const runnable = this.currentTest;
  const titlePath = typeof runnable?.titlePath === 'function' ? runnable.titlePath() : [];
  const rawTitle = (titlePath && titlePath.length ? titlePath[titlePath.length - 1] : runnable?.title) || '';
  const extractExampleIndex = (path: string[], title: string): { baseTitle: string; exampleIndex?: number } => {
    const exampleEntry = path.find((segment) => /example|row/i.test(segment));
    if (exampleEntry) {
      const match = exampleEntry.match(/(\d+)/);
      if (match) {
        const entryIndex = path.indexOf(exampleEntry);
        const baseTitle = entryIndex > 0 ? path[entryIndex - 1] : title;
        return { baseTitle: baseTitle || title, exampleIndex: Number(match[1]) };
      }
    }

    const inlineMatch =
      title.match(/\((?:example|row)?\s*#?\s*(\d+)\)\s*$/i) ||
      title.match(/\[(\d+)\]\s*$/) ||
      title.match(/#(\d+)\s*$/);
    if (inlineMatch) {
      const baseTitle = title.replace(inlineMatch[0], '').trim();
      return { baseTitle: baseTitle || title, exampleIndex: Number(inlineMatch[1]) };
    }

    return { baseTitle: title };
  };

  const { baseTitle, exampleIndex } = extractExampleIndex(titlePath, String(rawTitle || '').trim());
  const scenarioTitle = exampleIndex ? `${baseTitle} (${exampleIndex})` : baseTitle;
  setCurrentScenarioTitle(String(scenarioTitle || '').trim());

  const specRelative = String(Cypress.spec?.relative || '').replace(/\\/g, '/');
  let featurePath = specRelative.replace(/^cypress\/e2e\//, '');
  featurePath = featurePath.replace(/^functional\/opal\/features\//, '');
  setCurrentScenarioFeaturePath(featurePath || specRelative);
});

// Mark the scenario finish time and persist it for any account capture entries in this scenario.
afterEach(() => {
  const scenario = getCurrentScenarioTitle();
  const scenarioStartedAt = getCurrentScenarioStartedAt();
  const scenarioFinishedAt = new Date().toISOString();
  setCurrentScenarioFinishedAt(scenarioFinishedAt);

  return cy.task(
    'accountCapture:finalizeScenario',
    { scenario, scenarioStartedAt, scenarioFinishedAt },
    { log: false },
  );
});

// In open mode, release the per-run reset lock once the spec finishes.
after(() => {
  if (!Cypress.config('isInteractive')) {
    return;
  }
  return cy
    .task('accountCapture:releaseResetLock', undefined, { log: false })
    .then(() => cy.task('screenshot:cleanupEmptyDirs', undefined, { log: false }));
});

Cypress.on('uncaught:exception', (err) => {
  const message = String((err as any)?.message || err || '');

  console.error('UNCAUGHT EXCEPTION (Cypress global handler):', message);

  // Known noisy sourcemap/Base64 error coming from Cucumber/source-map internals.
  // We don't want this to fail the whole run.
  if (message.includes('Invalid string') && message.includes('Length must be a multiple of 4')) {
    return false; // don't fail the test run for this specific bug
  }

  // Let all other errors behave normally (fail the test)
  return true;
});
