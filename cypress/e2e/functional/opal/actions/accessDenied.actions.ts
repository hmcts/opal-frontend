/**
 * @fileoverview AccessDeniedActions
 * Provides reusable Cypress assertions for verifying the "Access Denied" page.
 * Includes checks for the heading, error message, and navigation back to the dashboard.
 *
 * @module actions/accessDenied.actions
 */

import * as Locators from '../../../../shared/selectors/accessDenied.locators';

/**
 * Asserts that the Access Denied page is displayed.
 *
 * Steps performed:
 *  1. Logs an entry in the Cypress runner for traceability.
 *  2. Verifies that the Access Denied heading is visible.
 *
 * @example
 *   assertAccessDeniedPage();
 */
export function assertAccessDeniedPage(): void {
  Cypress.log({
    name: 'access-denied',
    displayName: 'AccessDenied',
    message: 'Asserting Access Denied page is visible',
  });

  cy.get(Locators.accessDeniedHeading, { timeout: 10000 })
    .should('be.visible')
    .then(() => {
      Cypress.log({ name: 'assert', message: 'Access Denied heading is visible' });
    });
}

/**
 * Asserts that the Access Denied page displays the expected error message text.
 *
 * @param {string} expected - The expected error message substring.
 *
 * @example
 *   assertErrorMessage('You do not have permission to view this page');
 */
export function assertErrorMessage(expected: string): void {
  Cypress.log({
    name: 'error-message',
    displayName: 'AccessDenied',
    message: `Asserting error message contains: "${expected}"`,
  });

  cy.get(Locators.accessDeniedMessage, { timeout: 10000 })
    .should('contain.text', expected)
    .then(() => {
      Cypress.log({ name: 'assert', message: 'Error message text assertion passed' });
    });
}

/**
 * Asserts that the "Back to Dashboard" button (or link) is visible and labelled correctly.
 *
 * @param {string} label - The expected button text.
 *
 * @example
 *   assertBackToDashboardAction('Back to dashboard');
 */
export function assertBackToDashboardAction(label: string): void {
  Cypress.log({
    name: 'back-to-dashboard',
    displayName: 'AccessDenied',
    message: `Asserting Back to Dashboard button contains label: "${label}"`,
  });

  cy.get(Locators.backToDashboardBtn, { timeout: 10000 })
    .should('be.visible')
    .and('contain.text', label)
    .then(() => {
      Cypress.log({ name: 'assert', message: 'Back to Dashboard button visible and labelled correctly' });
    });
}
