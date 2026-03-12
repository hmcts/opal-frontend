import { performLogin } from '../actions/login.actions';
import { PrimaryNavigationActions } from '../actions/primary-navigation.actions';

const PRIMARY_NAVIGATION_LANDING_MAP = {
  Search: {
    header: 'Search for an account',
    path: '/fines/dashboard/search',
  },
  Accounts: {
    header: 'Accounts',
    path: '/fines/dashboard/accounts',
  },
  Finance: {
    header: 'Finance',
    path: '/fines/dashboard/finance',
  },
  Reports: {
    header: 'Reports',
    path: '/fines/dashboard/reports',
  },
  Administration: {
    header: 'Administration',
    path: '/fines/dashboard/administration',
  },
} as const;

/**
 * Flow helpers for Fines primary navigation scenarios.
 */
export class PrimaryNavigationFlow {
  private readonly actions = new PrimaryNavigationActions();

  /**
   * Logs in and lands on the Fines Search page.
   * @param email - User email used during authentication.
   */
  public loginAndLandOnSearch(email: string): void {
    performLogin(email);
    this.assertDefaultSearchLanding();
  }

  /**
   * Asserts the default Search landing state after login.
   */
  public assertDefaultSearchLanding(): void {
    this.actions.assertVisible();
    this.actions.assertMenuItemsInOrder();
    this.actions.assertActiveItem('Search');
    this.actions.assertSignOutVisible();
    this.actions.assertLandingPage('Search for an account', '/fines/dashboard/search');
  }

  /**
   * Asserts the default Search landing state in component tests.
   * Component testing runs inside the Cypress iframe, so browser pathname assertions
   * are not reliable there.
   */
  public assertDefaultSearchLandingInComponent(): void {
    this.actions.assertVisible();
    this.actions.assertMenuItemsInOrder();
    this.actions.assertActiveItem('Search');
    this.actions.assertSignOutVisible();
    this.actions.assertLandingPageHeader('Search for an account');
  }

  /**
   * Selects a top-level Fines area from the primary navigation.
   * @param itemLabel - Visible label of the target area.
   */
  public selectArea(itemLabel: string): void {
    this.actions.clickItem(itemLabel);
  }

  /**
   * Asserts the selected landing state for a top-level Fines area.
   * @param itemLabel - Visible label of the active area.
   * @param expectedHeader - Heading expected in the content area.
   * @param expectedPath - Path expected after the selection.
   */
  public assertAreaLanding(itemLabel: string, expectedHeader: string, expectedPath: string): void {
    this.actions.assertVisible();
    this.actions.assertActiveItem(itemLabel);
    this.actions.assertLandingPage(expectedHeader, expectedPath);
  }

  /**
   * Asserts the selected landing state for a top-level Fines area in component tests.
   * Component testing runs inside the Cypress iframe, so browser pathname assertions
   * are not reliable there.
   * @param itemLabel - Visible label of the active area.
   * @param expectedHeader - Heading expected in the content area.
   */
  public assertAreaLandingInComponent(itemLabel: string, expectedHeader: string): void {
    this.actions.assertVisible();
    this.actions.assertActiveItem(itemLabel);
    this.actions.assertLandingPageHeader(expectedHeader);
  }

  /**
   * Asserts the landing state for a known top-level Fines area.
   * @param itemLabel - Visible label of the active area.
   */
  public assertKnownAreaLanding(itemLabel: string): void {
    const landingArea = PRIMARY_NAVIGATION_LANDING_MAP[itemLabel as keyof typeof PRIMARY_NAVIGATION_LANDING_MAP];

    if (!landingArea) {
      throw new Error(`Unsupported primary navigation area: ${itemLabel}`);
    }

    this.assertAreaLanding(itemLabel, landingArea.header, landingArea.path);
  }

  /**
   * Signs the current user out from the primary navigation.
   */
  public signOut(): void {
    this.actions.clickSignOut();
  }

  /**
   * Asserts that the OPAL sign-in page is shown.
   */
  public assertSignInPageVisible(): void {
    this.actions.assertSignInPageVisible();
  }
}
