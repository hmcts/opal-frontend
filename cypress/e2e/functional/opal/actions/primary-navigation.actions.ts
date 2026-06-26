import { LoginLocators } from '../../../../shared/selectors/login.locators';
import { PrimaryNavigationLocators as L } from '../../../../shared/selectors/primary-navigation.locators';
import { CommonActions } from './common/common.actions';
import { createScopedLogger } from '../../../../support/utils/log.helper';
import { isLocalOrPrEnvironment } from './auth-environment.actions';

const log = createScopedLogger('PrimaryNavigationActions');

const PRIMARY_NAV_ITEMS = [
  { label: 'Search' },
  { label: 'Accounts' },
  { label: 'Finance' },
  { label: 'Reports' },
  { label: 'Administration' },
] as const;

const DASHBOARD_LINK_SELECTORS: Record<string, string> = {
  'Test Administration Link': '#testAdministrationLink',
  'Test Finance Link': '#testFinanceLink',
};

const DASHBOARD_ENTRY_POINTS: Record<string, string> = {
  Administration: '/fines/dashboard/administration',
  Finance: '/fines/dashboard/finance',
};

/**
 * Cypress actions for the Fines primary navigation and related header behaviour.
 */
export class PrimaryNavigationActions {
  private readonly common = new CommonActions();

  /**
   * Asserts the app-owned sign-in page is visible.
   */
  private assertAppSignInPageVisible(): void {
    cy.location('pathname', this.common.getPathTimeoutOptions()).should('include', '/sign-in');
    cy.get(LoginLocators.usernameInput, this.common.getTimeoutOptions()).should('be.visible');
  }

  /**
   * Asserts sign-out redirected away from the app to the Microsoft sign-in domain.
   *
   * @param href - Current browser URL after sign out.
   */
  private assertMicrosoftSignInRedirect(href: string): void {
    expect(href).to.include('login.microsoftonline.com');
  }

  /**
   * Asserts that the Fines primary navigation is visible.
   */
  public assertVisible(): void {
    log('assert', 'Checking primary navigation is visible');
    cy.get(L.container, this.common.getTimeoutOptions()).should('be.visible');
  }

  /**
   * Asserts the authenticated dashboard shell has loaded and is ready for navigation.
   */
  public assertDashboardLandingReady(): void {
    log('assert', 'Checking dashboard landing is ready for navigation');
    this.assertVisible();
    this.assertSignOutVisible();
    this.common.assertPageHeadingVisible();
    this.common.assertNoPageHeadingContains('there is a problem');
  }

  /**
   * Asserts that the Fines primary navigation is hidden.
   */
  public assertHidden(): void {
    log('assert', 'Checking primary navigation is hidden');
    cy.get('body', this.common.getTimeoutOptions()).find(L.container).should('not.exist');
  }

  /**
   * Asserts that the requested primary navigation item is not rendered.
   * @param itemLabel - Visible label of the navigation item expected to be hidden.
   */
  public assertItemHidden(itemLabel: string): void {
    if (!PRIMARY_NAV_ITEMS.some((item) => item.label === itemLabel)) {
      throw new Error(`Unsupported primary navigation item: ${itemLabel}`);
    }

    log('assert', 'Checking primary navigation item is hidden', { itemLabel });
    cy.get('body', this.common.getTimeoutOptions()).find(L.itemByText(itemLabel)).should('not.exist');
  }

  /**
   * Asserts that the top-level Fines navigation items appear in the expected order.
   */
  public assertMenuItemsInOrder(): void {
    log('assert', 'Checking primary navigation item order');
    const expectedItemOrder = PRIMARY_NAV_ITEMS.map((item) => item.label);

    cy.get(L.items, this.common.getTimeoutOptions()).then(($items) => {
      const labels = [...$items]
        .map((item) => item.textContent?.trim() ?? '')
        .filter((label): label is string => label.length > 0);
      // Search and Accounts are the stable baseline; the remaining items may be removed by flags.
      const expectedLeadingItems = PRIMARY_NAV_ITEMS.slice(0, 2).map((item) => item.label);
      const expectedVisibleItems = expectedItemOrder.filter((label) => labels.includes(label));

      expect(labels.slice(0, expectedLeadingItems.length), 'primary navigation leading items').to.deep.equal(
        expectedLeadingItems,
      );
      expect(labels).to.deep.equal(expectedVisibleItems);
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
      .should('be.visible')
      .and('have.attr', 'aria-current', 'page')
      .and('contain.text', itemLabel);

    cy.get(L.items, this.common.getTimeoutOptions()).then(($items) => {
      const renderedItems = [...$items].filter(
        (item): item is HTMLElement => (item.textContent?.trim().length ?? 0) > 0,
      );

      renderedItems
        .filter((item) => item.textContent?.trim() !== itemLabel)
        .forEach((item) => {
          expect(item).not.to.have.attr('aria-current');
        });
    });
  }

  /**
   * Selects a top-level Fines navigation item.
   * @param itemLabel - Visible label of the item to select.
   */
  public chooseItem(itemLabel: string): void {
    if (!PRIMARY_NAV_ITEMS.some((item) => item.label === itemLabel)) {
      throw new Error(`Unsupported primary navigation item: ${itemLabel}`);
    }

    log('action', 'Selecting primary navigation item', { itemLabel });
    cy.contains(`${L.container} .moj-primary-navigation__link`, itemLabel, this.common.getTimeoutOptions())
      .should('be.visible')
      .click();
  }

  /**
   * Opens a dashboard landing page link.
   * @param linkLabel - Visible label for the dashboard link.
   */
  public openLandingPageLink(linkLabel: string): void {
    const selector = DASHBOARD_LINK_SELECTORS[linkLabel];

    if (!selector) {
      throw new Error(`Unsupported dashboard link: ${linkLabel}`);
    }

    log('action', 'Opening dashboard landing page link', { linkLabel, selector });
    cy.get(selector, this.common.getTimeoutOptions()).should('be.visible').click();
  }

  /**
   * Navigates directly to a dashboard entry point.
   * @param dashboardLabel - Visible dashboard label.
   */
  public navigateDirectlyToEntryPoint(dashboardLabel: string): void {
    const path = DASHBOARD_ENTRY_POINTS[dashboardLabel];

    if (!path) {
      throw new Error(`Unsupported dashboard entry point: ${dashboardLabel}`);
    }

    log('navigate', 'Visiting dashboard entry point directly', { dashboardLabel, path });
    cy.visit(path);
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
    cy.get(LoginLocators.signOutLink, this.common.getTimeoutOptions())
      .should('be.visible')
      .and('contain.text', 'Sign out');
  }

  /**
   * Clicks the Sign out control in the account header navigation.
   */
  public clickSignOut(): void {
    log('action', 'Selecting Sign out');
    cy.get(LoginLocators.signOutLink, this.common.getTimeoutOptions()).should('be.visible').click();
  }

  /**
   * Asserts sign-out redirects to the expected authentication entry point.
   *
   * For local/PR environments this verifies the app-owned `/sign-in` page.
   * For higher environments it verifies the browser has been redirected to the
   * Microsoft sign-in domain without asserting Microsoft-owned page content.
   */
  public assertSignInPageVisible(): void {
    log('assert', 'Checking the sign-in page is displayed');
    const isLocalOrPr = isLocalOrPrEnvironment();

    cy.location('href', this.common.getPathTimeoutOptions()).then((href) => {
      if (isLocalOrPr) {
        this.assertAppSignInPageVisible();
        return;
      }

      this.assertMicrosoftSignInRedirect(href);
    });
  }
}
