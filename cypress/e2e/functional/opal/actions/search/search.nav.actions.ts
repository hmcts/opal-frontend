/**
 * @fileoverview account-search-nav.actions.ts
 * Navigation actions for the Account Search tabs:
 * - Individuals
 * - Companies
 * - Major creditors
 * - Minor creditors
 *
 * This class:
 *  - Uses AccountSearchNavLocators (tabs only)
 *  - Ensures each tab is visible
 *  - Clicks the desired tab if it is not already active
 *  - Verifies activation by checking the "selected" class
 */

import { createScopedLogger } from '../../../../../support/utils/log.helper';
import { AccountSearchNavLocators as Nav } from '../../../../../shared/selectors/account-search/account.search.nav.locators';

const log = createScopedLogger('AccountSearchNavActions');

export class AccountSearchNavActions {
  /**
   * Reliable tab activation helper.
   * - Clicking anchor/button inside tab (preferred)
   * - Asserts activation by URL hash OR by selected class
   * - Sonar-clean: no .push(), no .forEach(), uses for...of nowhere
   */
  private activateTab(tabSelector: string, label: string, expectedHash?: string): void {
    log('method', `activateTab(${label})`);

    // Click the interactive element inside the tab (anchor/button)
    cy.get(tabSelector, { timeout: 10_000 })
      .should('be.visible')
      .then(($li) => {
        const clickable = $li.find('a, button').first();

        if (clickable.length) {
          log('action', `Clicking ${label} tab (interactive element)`);
          cy.wrap(clickable).click({ force: true });
        } else {
          log('action', `Clicking ${label} tab (li fallback)`);
          cy.wrap($li).click({ force: true });
        }
      });

    // ───── Activation checks ───────────────────────────────────────────

    // 1) Check URL hash first if provided
    if (expectedHash) {
      cy.location('hash', { timeout: 10_000 }).should('eq', expectedHash);
      log('assert', `${label} tab activated via URL hash (${expectedHash})`);
      return;
    }

    // 2) Otherwise rely on GOV.UK selected class
    cy.get(tabSelector, { timeout: 10_000 })
      .should('have.class', 'govuk-tabs__list-item--selected')
      .then(() => log('assert', `${label} tab activated via CSS class`));

    log('done', `${label} tab activated`);
  }

  /** Navigates to the Individuals tab. */
  public goToIndividualsTab(): void {
    this.activateTab(Nav.individualsTab, 'Individuals');
  }

  /** Navigates to the Companies tab. */
  public goToCompaniesTab(): void {
    this.activateTab(Nav.companiesTab, 'Companies');
  }

  /** Navigates to the Major Creditors tab. */
  public goToMajorCreditorsTab(): void {
    this.activateTab(Nav.majorCreditorsTab, 'Major Creditors');
  }

  /** Navigates to the Minor Creditors tab. */
  public goToMinorCreditorsTab(): void {
    this.activateTab(Nav.minorCreditorsTab, 'Minor Creditors');
  }

  /**
   * Verifies a tab is selected using CSS class or optional URL hash.
   */
  private verifyTabSelected(tabSelector: string, label: string, expectedHash?: string): void {
    log('method', `verifyTabSelected(${label})`);

    // URL hash check (if provided)
    if (expectedHash) {
      cy.location('hash', { timeout: 10_000 })
        .should('eq', expectedHash)
        .then(() => log('assert', `${label} tab verified via URL hash (${expectedHash})`));
    }

    // CSS class check (always required)
    cy.get(tabSelector, { timeout: 10_000 })
      .should('have.class', 'govuk-tabs__list-item--selected')
      .then(() => log('assert', `${label} tab verified via selected CSS class`));

    log('done', `${label} tab verification complete`);
  }

  /** Verifies Individuals tab is active. */
  public verifyIndividualsTabActive(): void {
    this.verifyTabSelected(Nav.individualsTab, 'Individuals');
  }

  /** Verifies Companies tab is active. */
  public verifyCompaniesTabActive(): void {
    this.verifyTabSelected(Nav.companiesTab, 'Companies');
  }

  /** Verifies Major Creditors tab is active. */
  public verifyMajorCreditorsTabActive(): void {
    this.verifyTabSelected(Nav.majorCreditorsTab, 'Major Creditors');
  }

  /** Verifies Minor Creditors tab is active. */
  public verifyMinorCreditorsTabActive(): void {
    this.verifyTabSelected(Nav.minorCreditorsTab, 'Minor Creditors');
  }
}
