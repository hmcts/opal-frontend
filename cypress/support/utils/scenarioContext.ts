/**
 * @file scenarioContext.ts
 * Stores the current Cucumber scenario title for use in run-scoped logging/capture. Called from `beforeEach` in
 * `cypress/support/e2e.ts` to set the title and by capture helpers to read it.
 */
import { createUniqSuffix } from './stringUtils';

let currentScenarioTitle = 'Unknown scenario';
let currentScenarioStartedAt = new Date().toISOString();
let currentScenarioFinishedAt = '';

/**
 * Set the current scenario title and start time for downstream consumers. Typically called at the start of each test
 * via `beforeEach` in the Cypress support file.
 * @param title - Scenario title (will be normalized).
 * @example setCurrentScenarioTitle(this.currentTest?.title);
 */
export function setCurrentScenarioTitle(title?: string): void {
  const normalized = (title ?? '').toString().trim();
  currentScenarioTitle = normalized || 'Unknown scenario';
  currentScenarioStartedAt = new Date().toISOString();
  currentScenarioFinishedAt = '';
  Cypress.env('currentScenarioTitle', currentScenarioTitle);
  Cypress.env('currentScenarioStartedAt', currentScenarioStartedAt);
  Cypress.env('currentScenarioFinishedAt', null);
  Cypress.env('currentScenarioUniq', createUniqSuffix());
}

/**
 * Retrieve the current scenario title, preferring the Cypress env value set in `setCurrentScenarioTitle`.
 * @returns Scenario title.
 * @example const scenario = getCurrentScenarioTitle();
 */
export function getCurrentScenarioTitle(): string {
  const fromEnv = Cypress.env('currentScenarioTitle');
  if (typeof fromEnv === 'string' && fromEnv.trim()) {
    return fromEnv.trim();
  }
  return currentScenarioTitle;
}

/**
 * Retrieve the current scenario start time, preferring the Cypress env value set in `setCurrentScenarioTitle`.
 * @returns Scenario start timestamp.
 * @example const startedAt = getCurrentScenarioStartedAt();
 */
export function getCurrentScenarioStartedAt(): string {
  const fromEnv = Cypress.env('currentScenarioStartedAt');
  if (typeof fromEnv === 'string' && fromEnv.trim()) {
    return fromEnv.trim();
  }
  return currentScenarioStartedAt;
}

/**
 * Set the current scenario finish time for downstream consumers.
 * @param finishedAt - ISO timestamp for scenario completion (defaults to now).
 * @example setCurrentScenarioFinishedAt();
 */
export function setCurrentScenarioFinishedAt(finishedAt?: string): void {
  const resolved = finishedAt || new Date().toISOString();
  currentScenarioFinishedAt = resolved;
  Cypress.env('currentScenarioFinishedAt', resolved);
}

/**
 * Retrieve the current scenario finish time, preferring the Cypress env value set in `setCurrentScenarioFinishedAt`.
 * @returns Scenario finish timestamp.
 * @example const finishedAt = getCurrentScenarioFinishedAt();
 */
export function getCurrentScenarioFinishedAt(): string {
  const fromEnv = Cypress.env('currentScenarioFinishedAt');
  if (typeof fromEnv === 'string' && fromEnv.trim()) {
    return fromEnv.trim();
  }
  return currentScenarioFinishedAt;
}
