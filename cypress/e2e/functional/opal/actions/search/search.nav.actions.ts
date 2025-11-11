/**
 * @fileoverview AccountSearchNavActions
 * Handles navigation to the “Companies” tab in the Account Search UI.
 * Ensures visibility of the tabbed interface, activates the tab if required,
 * and verifies that the Companies form is loaded.
 */

import { AccountSearchCompaniesLocators as L } from '../../../../../shared/selectors/account.search.companies.locators';

export class AccountSearchNavActions {
  /**
   * Navigates to the Companies tab within the Account Search UI.
   *
   * Steps:
   *  1. Wait for the root search component and tabs container to be visible.
   *  2. Check if the Companies tab is already selected.
   *  3. Click it if not selected.
   *  4. Wait for the panel and inner form to load.
   *
   * @example
   * const nav = new AccountSearchNavActions();
   * nav.goToCompaniesTab();
   */
  goToCompaniesTab(): void {
    Cypress.log({ name: 'method', message: 'goToCompaniesTab()' });

    // Ensure search UI and tabs are visible
    Cypress.log({ name: 'assert', message: 'Ensuring search root and tabs are visible' });
    cy.get(L.root, { timeout: 15000 }).should('be.visible');
    cy.get(L.tabsContainer, { timeout: 15000 }).should('be.visible');

    // Inspect tab state
    Cypress.log({ name: 'check', message: 'Checking if Companies tab is already selected' });
    cy.get(L.companiesTabItem, { timeout: 15000 })
      .should('exist')
      .then(($li) => {
        const isSelected = $li.hasClass(L.selectedTabClass);
        Cypress.log({ name: 'tab-state', message: `Companies tab currently selected? ${isSelected}` });

        // Early return if tab already selected (avoids negated condition)
        if (isSelected) {
          Cypress.log({ name: 'skip', message: 'Companies tab already active — skipping click' });
          return;
        }

        // Click the tab when not selected
        Cypress.log({ name: 'click', message: 'Clicking Companies tab to activate it' });
        cy.get(L.companiesTab).should('be.visible').click({ force: true });
      });

    // Confirm activation and panel visibility
    Cypress.log({ name: 'wait', message: 'Waiting for Companies tab selection and panel load' });
    cy.get(L.companiesTabItem, { timeout: 15000 }).should('have.class', L.selectedTabClass);
    cy.get(L.companiesPanel, { timeout: 15000 }).should('be.visible');
    cy.get(L.companiesFormHost, { timeout: 15000 }).should('be.visible');

    Cypress.log({ name: 'done', message: 'Companies tab is active and ready' });
  }
}
