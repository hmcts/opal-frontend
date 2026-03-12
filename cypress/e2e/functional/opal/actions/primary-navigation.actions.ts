import { LoginLocators } from '../../../../shared/selectors/login.locators';
import { PrimaryNavigationLocators as L } from '../../../../shared/selectors/primary-navigation.locators';
import { CommonActions } from './common/common.actions';
import { createScopedLogger } from '../../../../support/utils/log.helper';

const log = createScopedLogger('PrimaryNavigationActions');

const PRIMARY_NAV_ITEMS = [
  { label: 'Search' },
  { label: 'Accounts' },
  { label: 'Finance' },
  { label: 'Reports' },
  { label: 'Administration' },
] as const;

/**
 * Cypress actions for the Fines primary navigation and related header behaviour.
 */
export class PrimaryNavigationActions {
  private readonly common = new CommonActions();

  /**
   * Asserts that the Fines primary navigation is visible.
   */
  public assertVisible(): void {
    log('assert', 'Checking primary navigation is visible');
    cy.get(L.container, this.common.getTimeoutOptions()).should('be.visible');
  }

  /**
   * Asserts that the top-level Fines navigation items appear in the expected order.
   */
  public assertMenuItemsInOrder(): void {
    log('assert', 'Checking primary navigation item order');
    cy.get(L.items, this.common.getTimeoutOptions())
      .should('have.length', PRIMARY_NAV_ITEMS.length)
      .then(($items) => {
        const labels = [...$items].map((item) => item.textContent?.trim() ?? '');
        expect(labels).to.deep.equal(PRIMARY_NAV_ITEMS.map((item) => item.label));
      });
  }

  /**
   * Asserts that the requested primary navigation item is active and the rest are inactive.
   * @param itemLabel - Visible label of the active item.
   */
  public assertActiveItem(itemLabel: string): void {
    if (!PRIMARY_NAV_ITEMS.some((item) => item.label === itemLabel)) {
      throw new Error(`Unsupported primary navigation item: ${itemLabel}`);
    }

    log('assert', 'Checking active primary navigation item', { itemLabel });
    cy.contains(`${L.container} .moj-primary-navigation__link`, itemLabel, this.common.getTimeoutOptions())
      .should('have.attr', 'aria-current', 'page')
      .and('contain.text', itemLabel);

    PRIMARY_NAV_ITEMS.filter((item) => item.label !== itemLabel).forEach((item) => {
      cy.contains(`${L.container} .moj-primary-navigation__link`, item.label, this.common.getTimeoutOptions()).should(
        'not.have.attr',
        'aria-current',
      );
    });
  }

  /**
   * Selects a top-level Fines navigation item.
   * @param itemLabel - Visible label of the item to select.
   */
  public clickItem(itemLabel: string): void {
    if (!PRIMARY_NAV_ITEMS.some((item) => item.label === itemLabel)) {
      throw new Error(`Unsupported primary navigation item: ${itemLabel}`);
    }

    log('action', 'Selecting primary navigation item', { itemLabel });
    cy.contains(`${L.container} .moj-primary-navigation__link`, itemLabel, this.common.getTimeoutOptions())
      .should('be.visible')
      .click();
  }

  /**
   * Asserts the landing page content and path for the selected Fines area.
   * @param expectedHeader - Heading expected in the main content area.
   * @param expectedPath - Path expected after the navigation event.
   */
  public assertLandingPage(expectedHeader: string, expectedPath: string): void {
    log('assert', 'Checking selected landing page', { expectedHeader, expectedPath });
    this.common.assertHeaderContains(expectedHeader);
    cy.location('pathname', this.common.getPathTimeoutOptions()).should('eq', expectedPath);
  }

  /**
   * Asserts only the landing page heading.
   * Intended for Cypress component tests, where the browser pathname remains on the iframe URL.
   * @param expectedHeader - Heading expected in the main content area.
   */
  public assertLandingPageHeader(expectedHeader: string): void {
    log('assert', 'Checking selected landing page header', { expectedHeader });
    this.common.assertHeaderContains(expectedHeader);
  }

  /**
   * Asserts that Sign out is visible in the account navigation area.
   */
  public assertSignOutVisible(): void {
    log('assert', 'Checking sign out link is visible');
    cy.get(L.signOutLink, this.common.getTimeoutOptions()).should('be.visible').and('contain.text', 'Sign out');
  }

  /**
   * Clicks the Sign out control in the account header navigation.
   */
  public clickSignOut(): void {
    log('action', 'Selecting Sign out');
    cy.get(L.signOutLink, this.common.getTimeoutOptions()).should('be.visible').click();
  }

  /**
   * Asserts the user is back on the sign-in page.
   */
  public assertSignInPageVisible(): void {
    log('assert', 'Checking the sign-in page is displayed');
    cy.location('pathname', this.common.getPathTimeoutOptions()).should('include', '/sign-in');
    cy.get(LoginLocators.usernameInput, this.common.getTimeoutOptions()).should('be.visible');
  }
}
