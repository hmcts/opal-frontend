// File: cypress/e2e/support/utils/log.helper.ts

/**
 * @file log.helper.ts
 * Centralized Cypress logging helper.
 */

export type LogScope =
  | 'method'
  | 'navigate'
  | 'assert'
  | 'action'
  | 'a11y'
  | 'wait'
  | 'done'
  | 'cancel'
  | 'dialog'
  | 'fallback'
  | 'verify';

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
