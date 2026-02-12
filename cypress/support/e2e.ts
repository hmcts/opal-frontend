// cypress/support/e2e.ts

// ***********************************************************
// This support file is processed and loaded automatically
// before your test files.
//
// Great place for global configuration / behaviour.
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
import 'cypress-axe';
import {
  getCurrentScenarioStartedAt,
  getCurrentScenarioTitle,
  getScenarioIndex,
  getNextScenarioIndex,
  resetScenarioCounters,
  setCurrentScenarioFinishedAt,
  setCurrentScenarioFeaturePath,
  setCurrentScenarioTitle,
} from './utils/scenarioContext';

// Simple marker so we can confirm in CI logs this file is actually loaded

console.log('*** Cypress e2e support file loaded ***');

export const isLegacy: boolean = Cypress.env('LEGACY_ENABLED');
console.log(`Legacy mode is ${isLegacy ? 'ENABLED' : 'DISABLED'}`);

// When running in Cypress open mode, reset evidence at the start of a spec run so only the latest
// run's JSON/screenshots are kept if the runner "refresh" button is used.
before(() => {
  resetScenarioCounters();
  if (!Cypress.config('isInteractive')) {
    return;
  }
  cy.task('accountCapture:resetEvidence', undefined, { log: false });
});

// Capture the current scenario title and reset the per-scenario `{uniq}` suffix.
beforeEach(function () {
  const runnable = this.currentTest;
  const titlePath = typeof runnable?.titlePath === 'function' ? runnable.titlePath() : [];
  const rawTitle = String(runnable?.title || '').trim();
  const featureTitle = String(titlePath?.[0] || '').trim();
  const specRelative = String(Cypress.spec?.relative || '').replace(/\\/g, '/');
  const specName = String(Cypress.spec?.name || '').trim();
  const featureFile = specRelative.split('/').pop() || specName || specRelative;

  let baseTitle = rawTitle;
  if (!baseTitle || /^examples?:/i.test(baseTitle) || /^(example|row)\b/i.test(baseTitle)) {
    baseTitle = featureTitle || rawTitle || 'Unknown scenario';
  }

  const featureKey = specRelative || featureTitle || featureFile || 'unknown-feature';
  const retryCount = typeof runnable?.currentRetry === 'function' ? runnable.currentRetry() : 0;
  const existingIndex = retryCount > 0 ? getScenarioIndex(featureKey, baseTitle) : 0;
  const occurrenceIndex =
    retryCount > 0 && existingIndex > 0 ? existingIndex : getNextScenarioIndex(featureKey, baseTitle);
  const scenarioTitle = occurrenceIndex > 1 ? `${baseTitle} (${occurrenceIndex})` : baseTitle;
  setCurrentScenarioTitle(String(scenarioTitle || '').trim());
  setCurrentScenarioFeaturePath(featureFile || specRelative);
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
