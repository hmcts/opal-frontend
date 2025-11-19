/**
 * @fileoverview ResultsActions
 * Shared Cypress actions for the Account Search **results** page.
 * Centralises: waiting for results to load, opening the first/latest row,
 * and opening by a specific account number.
 */

import { AccountEnquiryResultsLocators as R } from '../../../../shared/selectors/account-enquiry-results.locators';

/**
 * High-level Actions for the Search Results page.
 * Provides consistent logging, explicit waits, and convenient open helpers.
 */
export class ResultsActions {
  /** Default timeout (ms) used by this actions class. */
  private static readonly WAIT_MS = 15_000;

  /**
   * Standardized logger to keep Cypress runner output tidy and searchable.
   * @param name Short category label (e.g. "wait", "open", "assert").
   * @param message Human-friendly description.
   * @param data Optional extra context shown in the runner's console props.
   */
  private log(name: string, message: string, data?: Record<string, unknown>): void {
    Cypress.log({
      name,
      message,
      consoleProps: () => ({ actions: 'ResultsActions', message, ...data }),
    });
  }

  /**
   * Waits for the Search results table to appear and be visible (no row assertion).
   * Useful when a test just needs the table present before other actions.
   */
  public waitForResultsTable(): void {
    this.log('wait', 'Waiting for Search results table');
    cy.get(R.page.heading, { timeout: ResultsActions.WAIT_MS })
      .should('be.visible')
      .and('contain.text', 'Search results');
    cy.get(R.table.root, { timeout: ResultsActions.WAIT_MS }).should('be.visible');
  }

  /**
   * Asserts we are on the results route and the table contains at least one row.
   *
   * Steps:
   *  - Wait for `/fines/search-accounts/results` in the pathname
   *  - Assert heading contains "Search results"
   *  - Assert results table is visible and has at least 1 row
   */
  public assertOnResults(): void {
    this.log('assert', 'Asserting on results route and non-empty table');
    cy.location('pathname', { timeout: ResultsActions.WAIT_MS }).should('include', '/fines/search-accounts/results');
    cy.get(R.page.heading, { timeout: ResultsActions.WAIT_MS }).should('contain.text', 'Search results');
    cy.get(R.table.root, { timeout: ResultsActions.WAIT_MS }).should('be.visible');
    cy.get(R.table.rows, { timeout: ResultsActions.WAIT_MS }).should('have.length.greaterThan', 0);
  }

  /**
   * Opens the **latest** (first row) account in the results table.
   * Captures the account number as `@openedAccountNumber` for downstream steps.
   * Uses `{ force: true }` for robustness when rows are partially obscured.
   */
  public openLatestPublished(): void {
    this.log('open', 'Opening latest (first row) account');

    // Ensure at least one row exists to reduce flakiness
    cy.get(R.table.rows, { timeout: ResultsActions.WAIT_MS })
      .should('have.length.greaterThan', 0)
      .first()
      .within(() => {
        cy.get(R.cols.accountLink, { timeout: 10_000 })
          .scrollIntoView()
          .then(($a) => {
            const acctNo = $a.text().trim();

            // Save for later steps without noisy logging
            cy.wrap(acctNo, { log: false }).as('openedAccountNumber');
            this.log('alias', 'Captured opened account number', { openedAccountNumber: acctNo });

            // IMPORTANT: click the element we already grabbed;
            // this avoids switching the subject to the string alias.
            cy.wrap($a).click({ force: true });
          });
      });

    this.assertNavigatedToDetails();
  }

  /**
   * Opens a specific account **by account number** from the results table.
   * @param accountNumber Visible account number to open.
   */
  public openByAccountNumber(accountNumber: string): void {
    this.log('open', 'Opening by specific account number', { accountNumber });

    cy.get(R.table.root, { timeout: ResultsActions.WAIT_MS }).should('be.visible');

    // Dynamic locator is defined in the locators file
    cy.get(R.linkByAccountNumber(accountNumber), { timeout: 8_000 })
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });

    this.assertNavigatedToDetails();
  }

  /**
   * Confirms navigation to an account details route (accounts or draft-accounts).
   */
  private assertNavigatedToDetails(): void {
    cy.location('pathname', { timeout: ResultsActions.WAIT_MS }).should((p) => {
      expect(p, 'navigated to details').to.match(/^\/fines\/account\/defendant\/[A-Za-z0-9-]+\/details$/);
    });
  }

  /**
   * Clicks the account link for a specific account number on the current page.
   *
   * @param acc - Account number to click.
   * @returns The clicked link element.
   */
  public clickAccountOnCurrentPage(acc: string): Cypress.Chainable<JQuery<HTMLElement>> {
    this.log('click', 'Click account link on current page', { accountNumber: acc });
    return cy.get(R.linkByAccountNumber(acc), { timeout: 5_000 }).scrollIntoView().click({ force: true });
  }
}

export default ResultsActions;
