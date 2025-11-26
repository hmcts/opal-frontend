/**
 * @fileoverview AccountDetailsDefendantActions
 * Provides reusable UI interactions and assertions for the Defendant Details page.
 * Supports both individual and company account contexts.
 *
 * @module actions/account.details.actions
 */
import { AccountDefendantDetailsLocators as L } from '../../../../../shared/selectors/account-details/account.defendant-details.locators';
import { CommonActions } from '../common/common.actions';

export class AccountDetailsDefendantActions {
  readonly common = new CommonActions();

  /**
   * Assert page header contains expected text
   * @param expected
   */
  assertHeaderContains(expected: string): void {
    cy.get(L.header, { timeout: 15000 }).should('contain.text', expected);
  }

  /**
   * Assert section header text matches expectation
   * @param expected
   */
  assertSectionHeader(expected: string): void {
    cy.get(L.defendantTabHeader.title, { timeout: 10000 })
      .should('be.visible')
      .invoke('text')
      .then((t) => expect(t.trim().toLowerCase()).to.contain(expected.trim().toLowerCase()));
  }

  /**
   * Clicks the top-right "Change" link in the Defendant tab header.
   *
   * Ensures the tab header is visible first, scrolls the link into view,
   * then clicks it. Optionally waits for a supplied form selector to appear.
   *
   * @param {Object} [opts]
   * @param {number} [opts.timeout=10000] - Max time to wait for elements.
   * @param {string} [opts.formSelector] - If provided, waits for this form to be visible after clicking.
   */
  change(opts?: { timeout?: number; formSelector?: string }): void {
    const timeout = opts?.timeout ?? 10_000;

    // Make sure we're on the Defendant tab and its header is visible
    cy.get(L.defendantTabHeader.title, { timeout }).should('be.visible');

    // Click the "Change" link in the Defendant tab header
    cy.get(L.defendantTabHeader.changeLink, { timeout }).should('be.visible').scrollIntoView().click({ force: true });

    // Optionally wait for the edit form to appear
    if (opts?.formSelector) {
      cy.get(opts.formSelector, { timeout }).should('be.visible');
    }
  }
}
