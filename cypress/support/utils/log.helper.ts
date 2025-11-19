// File: cypress/e2e/support/utils/log.helper.ts

/**
 * @file log.helper.ts
 * Centralized Cypress logging helper.
 */

export type LogScope =
  | 'action'
  | 'a11y'
  | 'assert'
  | 'cancel'
  | 'comments'
  | 'click'
  | 'complete'
  | 'debug'
  | 'dialog'
  | 'done'
  | 'edit'
  | 'fallback'
  | 'flow'
  | 'info'
  | 'input'
  | 'locator'
  | 'match'
  | 'method'
  | 'navigate'
  | 'open'
  | 'prepare'
  | 'results'
  | 'save'
  | 'search'
  | 'verify'
  | 'wait'
  | 'warn';

export function log(scope: LogScope, message: string, details?: Record<string, unknown>): void {
  Cypress.log({
    name: scope,
    message,
    // show structured details in the Cypress runner console
    consoleProps: () => details ?? {},
  });

  // runner UI message
  cy.log(`[${scope.toUpperCase()}] ${message}`);
}
