/**
 * @fileoverview access-denied.actions.ts
 * Provides reusable Cypress assertions for verifying the "Access Denied" page.
 * Includes checks for the heading, error message, and navigation back to the dashboard.
 */

import * as L from '../../../../shared/selectors/access-denied.locators';
import { log } from '../../../../support/utils/log.helper';

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
  log('assert', 'Asserting Access Denied page is visible');

  cy.get(L.accessDeniedHeading, { timeout: 10_000 })
    .should('be.visible')
    .then(() => {
      log('done', 'Access Denied heading is visible');
    });
}

/**
 * Asserts that the Access Denied page displays the expected error message text.
 *
 * @param expected - The expected error message substring.
 *
 * @example
 *   assertErrorMessage('You do not have permission to view this page');
 */
export function assertErrorMessage(expected: string): void {
  log('assert', `Asserting error message contains: "${expected}"`);

  cy.get(L.accessDeniedMessage, { timeout: 10_000 })
    .should('contain.text', expected)
    .then(() => {
      log('done', 'Error message text assertion passed');
    });
}

/**
 * Asserts that the "Back to Dashboard" button (or link) is visible and labelled correctly.
 *
 * @param label - The expected button text.
 *
 * @example
 *   assertBackToDashboardAction('Back to dashboard');
 */
export function assertBackToDashboardAction(label: string): void {
  log('assert', `Asserting Back to Dashboard button contains label: "${label}"`);

  cy.get(L.backToDashboardBtn, { timeout: 10_000 })
    .should('be.visible')
    .and('contain.text', label)
    .then(() => {
      log('done', 'Back to Dashboard button visible and labelled correctly');
    });
}
