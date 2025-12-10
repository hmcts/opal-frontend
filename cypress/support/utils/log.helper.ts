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
  | 'check'
  | 'comments'
  | 'clear'
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
  | 'name'
  | 'navigate'
  | 'navigation'
  | 'open'
  | 'prepare'
  | 'results'
  | 'save'
  | 'search'
  | 'select'
  | 'step'
  | 'type'
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

/**
 * Synchronous logger for Cypress callback contexts.
 *
 * Unlike `log()`, this version does NOT call `cy.log()`, meaning it can safely
 * be used inside Cypress command callbacks such as:
 *   • cy.intercept(... req.reply(...))
 *   • cy.wait(alias).then(...)
 *   • Promise or event handlers
 *
 * It uses only `Cypress.log()`, which does not enqueue Cypress commands.
 */
export function logSync(scope: LogScope, message: string, details?: Record<string, unknown>): void {
  Cypress.log({
    name: scope,
    message,
    consoleProps: () => details ?? {},
  });
}

/**
 * Creates a scoped logger that automatically tags log entries with a `scope` field (e.g., flow/action name).
 * @param scopeName - Logical scope to include in log details (e.g., "ManualAccountCreationFlow").
 * @returns A logger function matching the `log` signature that injects the scope name.
 *
 * @example
 * const log = createScopedLogger('AccountSearchFlow');
 * log('navigate', 'Opening account search');
 */
export const createScopedLogger = (scopeName: string) => {
  return (scope: LogScope, message: string, details?: Record<string, unknown>): void => {
    log(scope, message, { scope: scopeName, ...details });
  };
};
