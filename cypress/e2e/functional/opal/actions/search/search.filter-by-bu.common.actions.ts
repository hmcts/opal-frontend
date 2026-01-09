/**
 * @file search.filter-by-bu.common.actions.ts
 * @description
 * Common actions for Filter-by-Business-Unit pages (Fines & Confiscation).
 */

import { SearchFilterByBUCommonLocators } from '../../../../../shared/selectors/account-search/account.search.filter-by-bu.common.locators';
import { CommonActions } from '../common/common.actions';
import { createScopedLogger } from '../../../../../support/utils/log.helper';

const log = createScopedLogger('SearchFilterByBUCommonActions');

/** Shared controls for the Filter by Business Unit page. */
export class SearchFilterByBUCommonActions {
  private readonly commonActions = new CommonActions();

  /** Verifies the page heading is "Filter by business unit" */
  verifyHeader(): void {
    log('info', 'Verifying Filter by business unit header');
    cy.get(SearchFilterByBUCommonLocators.heading).should('contain.text', 'Filter by business unit');
  }

  /** Clicks the primary save selection button */
  saveSelection(): void {
    log('info', 'Saving business unit selection');
    cy.get(SearchFilterByBUCommonLocators.saveSelectionButton).click();
  }

  /** Clicks the cancel link */
  cancel(): void {
    log('info', 'Cancelling business unit selection');
    cy.get(SearchFilterByBUCommonLocators.cancelLink).click();
  }

  /** Ensures the save selection button is visible */
  verifySaveSelectionVisible(): void {
    log('info', 'Verifying Save Selection button is visible');
    cy.get(SearchFilterByBUCommonLocators.saveSelectionButton).should('be.visible');
  }

  /** Ensures the cancel link is visible */
  verifyCancelLinkVisible(): void {
    log('info', 'Verifying Cancel link is visible');
    cy.get(SearchFilterByBUCommonLocators.cancelLink).should('be.visible');
  }

  /**
   * Verifies that the "Save selection" button shows a total of `x`,
   * where `x` is passed in (derived from the number of rows in a map earlier).
   *
   * Example button text: "Save selection (54)"
   *
   * @param expectedTotal - total number that should be shown in the button label
   */
  verifySaveSelectionTotal(expectedTotal: number): void {
    log('info', `Verifying Save selection button displays total: ${expectedTotal}`);

    cy.get(SearchFilterByBUCommonLocators.saveSelectionButton)
      .invoke('text')
      .then((text) => {
        const trimmed = text.trim();
        log('info', `Current Save selection button text: "${trimmed}"`);
      });

    cy.get(SearchFilterByBUCommonLocators.saveSelectionButton).should(
      'contain.text',
      `Save selection (${expectedTotal})`,
    );
  }

  /**
   * Asserts the Business Unit filter summary text on the Account Search page.
   *
   * Looks for the summary row whose key is "Filter by business unit" and
   * asserts the value cell contains the expected text.
   *
   * @param expectedSummary - e.g. "Bedfordshire Bolton Berwick"
   */
  public assertBusinessUnitFilterSummary(expectedSummary: string): void {
    log('assert', `Asserting business unit filter summary equals "${expectedSummary}"`);

    cy.contains('dt.govuk-summary-list__key', 'Filter by business unit', this.commonActions.getTimeoutOptions())
      .should('be.visible')
      .parent()
      .within(() => {
        cy.get('.govuk-summary-list__value')
          .should('be.visible')
          .invoke('text')
          .then((text) => text.replaceAll(/\s+/g, ' ').trim())
          .should('eq', expectedSummary);
      });
  }
}
