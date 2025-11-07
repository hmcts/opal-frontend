/**
 * @fileoverview AccountSearchIndividualsActions
 * High-level actions for the “Search for an account” ➜ Individuals tab.
 * Now includes shared search-page assertion logic.
 */

import { AccountSearchIndividualsLocators as L } from '../../../../../shared/selectors/account.search.individuals.locators';
import { ResultsActions } from '../search.results.actions';

export class AccountSearchIndividualsActions {
  private readonly results = new ResultsActions();

  /**
   * Asserts that the user is on the “Search for an Account” page.
   * Steps:
   *  1. Verifies the current URL includes `/fines/search-accounts/search`.
   *  2. Ensures the search form root component is visible.
   *
   * @example
   *   searchIndividuals.assertOnSearchPage();
   */
  assertOnSearchPage(): void {
    Cypress.log({ name: 'assert', message: 'Verifying Search for an Account page URL' });
    cy.location('pathname', { timeout: 10000 }).should('include', '/fines/search-accounts/search');

    Cypress.log({ name: 'assert', message: 'Ensuring search form is visible' });
    cy.get(L.searchFormRoot, { timeout: 10000 }).should('be.visible');

    Cypress.log({ name: 'done', message: 'Search for an Account page is ready' });
  }

  /**
   * Performs a search by last name and waits for results to load.
   *
   * @param {string} lastName - The last name to search for.
   */
  byLastName(lastName: string): void {
    cy.get(L.lastNameInput, { timeout: 10000 }).clear().type(lastName);
    cy.get(L.searchButton).should('be.enabled').click();

    this.results.assertOnResults();
  }
}
