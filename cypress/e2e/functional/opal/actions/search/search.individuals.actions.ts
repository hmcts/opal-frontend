/**
 * @fileoverview search-individuals.actions.ts
 * High-level actions for the “Search for an account” ➜ Individuals
 * Now includes shared search-page assertion logic.
 */

import { AccountSearchIndividualsLocators as L } from '../../../../../shared/selectors/account-search/account.search.individuals.locators';
import { ResultsActions } from '../search.results.actions';
import { log } from '../../../../../support/utils/log.helper';

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
  public assertOnSearchPage(): void {
    log('assert', 'Verifying Search for an Account page URL');
    cy.location('pathname', { timeout: 10_000 }).should('include', '/fines/search-accounts/search');

    log('assert', 'Ensuring search form is visible');
    cy.get(L.searchFormRoot, { timeout: 10_000 }).should('be.visible');

    log('action', 'Search for an Account page is ready');
  }

  /**
   * Performs a search by last name and waits for results to load.
   *
   * @param lastName - The last name to search for.
   */
  public byLastName(lastName: string): void {
    log('action', `Submitting search by last name: "${lastName}"`);
    cy.get(L.lastNameInput, { timeout: 10_000 }).clear().type(lastName);

    cy.get(L.searchButton, { timeout: 10_000 }).should('be.enabled').click();

    log('assert', 'Verifying results are displayed');
    this.results.assertOnResults();
  }
}
