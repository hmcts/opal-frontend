/**
 * @file dashboard.locators.ts
 * @description
 * Selector map for the **Dashboard Page**.
 * Centralises element locators for navigation links and user context elements.
 *
 * @remarks
 * - Each key corresponds to a visible element or action entry point on the dashboard.
 * - Prefer `data-testid` attributes if available; fallback IDs are retained for legacy support.
 * - Used by DashboardActions and related navigation flows.
 *
 * @example
 *   cy.get(DashboardLocators.manualAccountCreationLink).click();
 */
export const DashboardLocators = {
  /** Page title element at the top of the dashboard. */
  dashboardPageTitle: 'h1.govuk-heading-m',

  /** Displays the logged-in user’s name in the header area. */
  userName: '.govuk-grid-column-two-thirds ul li span',

  /** Link or button to open the Manual Account Creation workflow. */
  manualAccountCreationLink: '#finesMacLink',

  /** Link to open the Account Search interface. */
  searchForAnAccountLink: '#finesSaSearchLink',
};
