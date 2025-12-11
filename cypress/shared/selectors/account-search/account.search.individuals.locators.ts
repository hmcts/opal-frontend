/**
 * @file accountSearchIndividuals.locators.ts
 * @description
 * Selector map for the **Account Search – Individuals** page.
 * Defines locators for the search form, input fields, date picker,
 * navigation links, and other UI elements within the Individuals tab.
 *
 * @remarks
 * - Scoping is critical: always query within `AccountSearchIndividualsLocators.root`
 *   to avoid collisions with similar search components (e.g., Company Search).
 * - Supports both `data-testid` and legacy ID-based selectors for stability.
 * - Designed for use by SearchActions, AccountEnquiryFlow, and dashboard navigation tests.
 *
 * @example
 * ```ts
 * // Example: search by last name and submit form
 * cy.get(AccountSearchIndividualsLocators.lastNameInput).type('Smith');
 * cy.get(AccountSearchIndividualsLocators.searchButton).click();
 * ```
 *
 * @see {@link AccountSearchIndividualsActions}
 */

export const AccountSearchIndividualsLocators = {
  // ──────────────────────────────
  // Root / layout elements
  // ──────────────────────────────

  /** Top-level selector for the Individuals search form and wrapper components. */
  root: 'app-fines-sa-search-account-form, app-fines-sa-search, [data-testid="fines-sa-search"]',

  /** Main page content area for accessibility and layout scoping. */
  main: 'main[role="main"].govuk-main-wrapper',

  // ──────────────────────────────
  // Header navigation links
  // ──────────────────────────────

  /** "Sign out" link in the top navigation bar. */
  signOutLink: 'nav[aria-label="Account navigation"] a.moj-header__navigation-link',

  /** Organisation link in header (usually HMCTS). */
  orgLink: 'a.moj-header__link--organisation-name',

  /** Service name link in header (usually Opal). */
  serviceLink: 'a.moj-header__link--service-name',

  // ──────────────────────────────
  // Individuals search panel
  // ──────────────────────────────

  /** Panel element containing all individual search input fields. */
  individualsPanel: '#individuals .govuk-tabs__panel',

  // ──────────────────────────────
  // Name fields
  // ──────────────────────────────

  /** Last name input field. */
  lastNameInput: '#fsa_search_account_individuals_last_name',

  /** Checkbox to restrict last name search to exact matches only. */
  lastNameExactMatchCheckbox: '#fsa_search_account_individuals_last_name_exact_match',

  /** First name input field. */
  firstNameInput: '#fsa_search_account_individuals_first_names',

  /** Checkbox to restrict first name search to exact matches only. */
  firstNamesExactMatchCheckbox: '#fsa_search_account_individuals_first_names_exact_match',

  /** Checkbox to include known aliases in search. */
  includeAliasesCheckbox: '#fsa_search_account_individuals_include_aliases',

  // ──────────────────────────────
  // Date of birth (MOJ date picker)
  // ──────────────────────────────

  /** Input for date of birth (uses MOJ date picker). */
  dobInput: '#fsa_search_account_individuals_date_of_birth',

  /** Date picker modal dialog container. */
  dobCalendarDialog: '#datepicker-fsa_search_account_individuals_date_of_birth',

  /** Button to open the date picker modal. */
  dobOpenButton: '.moj-js-datepicker-toggle',

  /** Button to confirm selected date in date picker. */
  dobSelectButton: '.moj-datepicker__button.moj-js-datepicker-ok',

  /** Button to close the date picker without applying a change. */
  dobCloseButton: '.moj-datepicker__button.moj-js-datepicker-cancel',

  // ──────────────────────────────
  // Other individual fields
  // ──────────────────────────────

  /** National Insurance Number input field. */
  niNumberInput: '#fsa_search_account_individuals_national_insurance_number',

  /** Address Line 1 input field. */
  addressLine1Input: '#fsa_search_account_individuals_address_line_1',

  /** Postcode input field. */
  postcodeInput: '#fsa_search_account_individuals_post_code',

  // ──────────────────────────────
  // Dashboard navigation
  // ──────────────────────────────

  /** Link from Dashboard to “Search for an Account” (entry point to this form). */
  searchLinkFromDashboard: '#finesSaSearchLink',

  /** Root selector for the search form component. */
  searchFormRoot: 'app-fines-sa-search, [data-testid="fines-sa-search"]',
};
