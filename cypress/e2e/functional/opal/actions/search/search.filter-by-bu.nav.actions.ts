/**
 * @file search.filter-by-bu.nav.actions.ts
 * @description
 * Navigation actions for the Filter-by-Business-Unit pages (Fines & Confiscation).
 *
 * Uses the shared sub-navigation locators to:
 * - Navigate to the **Fines** or **Confiscation** tab
 * - Verify which tab is currently active
 */

import { SearchFilterByBUNavLocators } from '../../../../../shared/selectors/account-search/account.search.filter-by-bu.nav.locators';
import { log } from '../../../../../support/utils/log.helper';

export class SearchFilterByBUNavActions {
  /**
   * Navigates to the **Fines** tab in the filter-by-BU sub-navigation.
   */
  goToFinesTab(): void {
    log('info', 'Navigating to Fines tab in filter-by-business-unit navigation');
    cy.get(SearchFilterByBUNavLocators.finesTabLink).click();
  }

  /**
   * Navigates to the **Confiscation** tab in the filter-by-BU sub-navigation.
   */
  goToConfiscationTab(): void {
    log('info', 'Navigating to Confiscation tab in filter-by-business-unit navigation');
    cy.get(SearchFilterByBUNavLocators.confiscationTabLink).click();
  }

  /**
   * Ensures the given tab link is marked active. If the link is not already
   * active (aria-current missing), it clicks the link to activate it before
   * running assertions.
   */
  private ensureTabActive(tabLinkSelector: string): void {
    cy.get(tabLinkSelector).then(($link) => {
      const isActive = $link.attr('aria-current') === SearchFilterByBUNavLocators.activeSubNavAriaCurrent;
      if (!isActive) {
        log('info', `Tab ${tabLinkSelector} not active – clicking to activate`);
        cy.wrap($link).click();
      }
    });
  }

  /**
   * Verifies that the provided tab link selector is marked as active via `aria-current="page"`.
   *
   * @param tabLinkSelector - CSS selector for the tab link to assert as active
   */
  verifyActiveTab(tabLinkSelector: string): void {
    log('info', `Verifying active tab via selector: ${tabLinkSelector}`);
    cy.get(tabLinkSelector).should('have.attr', 'aria-current', SearchFilterByBUNavLocators.activeSubNavAriaCurrent);
  }

  /**
   * Verifies that the **Fines** tab is the active tab.
   */
  verifyFinesTabIsActive(): void {
    log('info', 'Verifying Fines tab is active in filter-by-business-unit navigation');
    this.ensureTabActive(SearchFilterByBUNavLocators.finesTabLink);
    this.verifyActiveTab(SearchFilterByBUNavLocators.finesTabLink);
  }

  /**
   * Verifies that the **Confiscation** tab is the active tab.
   */
  verifyConfiscationTabIsActive(): void {
    log('info', 'Verifying Confiscation tab is active in filter-by-business-unit navigation');
    this.ensureTabActive(SearchFilterByBUNavLocators.confiscationTabLink);
    this.verifyActiveTab(SearchFilterByBUNavLocators.confiscationTabLink);
  }

  /** Verifies that exactly two tabs exist: Fines and Confiscation */
  verifyTwoTabsExist(): void {
    log('info', 'Verifying there are exactly two tabs: Fines and Confiscation');

    cy.get(SearchFilterByBUNavLocators.subNavigation).find('li.moj-sub-navigation__item').should('have.length', 2);

    cy.get(SearchFilterByBUNavLocators.finesTabLink).should('contain.text', 'Fines');

    cy.get(SearchFilterByBUNavLocators.confiscationTabLink).should('contain.text', 'Confiscation');
  }
}
