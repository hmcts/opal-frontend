/**
 * @fileoverview AccountSearchCompanyActions
 * High-level actions for the "Search for an account" ➜ Companies tab.
 * Delegates all results-page behaviours to ResultsActions to avoid duplication.
 */

import { AccountSearchCompaniesLocators as L } from '../../../../../shared/selectors/account-search/account.search.companies.locators';
import { ResultsActions } from '../search.results.actions';

export class AccountSearchCompanyActions {
  private readonly results = new ResultsActions();

  /**
   * Performs a search by company name and waits for results to load.
   *
   * @param {string} companyName - The company name to search for.
   */
  byCompanyName(companyName: string): void {
    cy.get(L.companyNameInput, { timeout: 10000 }).clear().type(companyName);
    cy.get(L.searchButton).should('be.enabled').click();
  }
}
