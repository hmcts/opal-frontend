/**
 * @file accountSearchCompanies.locators.ts
 * @description
 * Selector map for the **Account Search – Companies tab** on the HMCTS Opal
 * “Search for an account” page.
 *
 * Defines locators for headers, navigation tabs, search fields, filters,
 * and global page elements specific to the *Companies* search context.
 *
 * @remarks
 * - Supports both legacy (`app-fines-sa-search-account-form`) and
 *   modern (`data-testid="fines-sa-search"`) Angular component selectors.
 * - Always scope within {@link AccountSearchCompaniesLocators.root} when
 *   running Cypress commands to avoid conflicts with the Individuals tab.
 * - Used primarily by `AccountSearchCompanyActions` and higher-level
 *   flows such as `AccountEnquiryFlow`.
 *
 * @example
 * ```ts
 * // Example: search by company name
 * cy.get(AccountSearchCompaniesLocators.companyNameInput).type('Acme Ltd');
 * cy.get(AccountSearchCompaniesLocators.searchButton).click();
 * ```
 *
 * @see {@link AccountSearchCompanyActions}
 */

export const AccountSearchCompaniesLocators = {
  // ──────────────────────────────
  // Root / layout elements
  // ──────────────────────────────

  /** Covers both historic & current Angular components for the search form. */
  root: 'app-fines-sa-search-account-form, app-fines-sa-search, [data-testid="fines-sa-search"]',

  /** Main page content area wrapper. */
  main: 'main[role="main"].govuk-main-wrapper',

  // ──────────────────────────────
  // Header navigation links
  // ──────────────────────────────

  /** "Sign out" link in the global header navigation. */
  signOutLink: 'nav[aria-label="Account navigation"] a.moj-header__navigation-link',

  /** HMCTS organisation name link. */
  orgLink: 'a.moj-header__link--organisation-name',

  /** Opal service name link in header. */
  serviceLink: 'a.moj-header__link--service-name',

  // ──────────────────────────────
  // Headers and titles
  // ──────────────────────────────

  /** Page H1 heading: "Search for an account". */
  pageHeader: 'app-fines-sa-search-account-form h1.govuk-heading-l',

  /** Inner Companies panel heading (inside Companies tab). */
  companiesHeader: '#companies h1.govuk-heading-l',

  /** Tabs title, e.g. "Contents". */
  contentsTitle: '#defendantTabs .govuk-tabs__title',

  // ──────────────────────────────
  // Summary filter (Business Unit)
  // ──────────────────────────────

  /** Summary row container for Business Unit filter. */
  businessUnitRow: '#accountDetailsLanguagePreferences',

  /** Key label element within Business Unit summary row. */
  businessUnitKey: '#accountDetailsLanguagePreferencesKey',

  /** Value element showing the current Business Unit. */
  businessUnitValue: '#accountDetailsLanguagePreferencesValue',

  /** "Change" link for modifying Business Unit filter. */
  businessUnitChangeLink: '#accountDetailsLanguagePreferencesActions a.govuk-link',

  // ──────────────────────────────
  // Top-level search fields (above tabs)
  // ──────────────────────────────

  /** Account number input field. */
  accountNumberInput: '#fsa_search_account_number',

  /** Reference or case number input field. */
  referenceOrCaseNumberInput: '#fsa_search_account_reference_case_number',

  // ──────────────────────────────
  // Tabs / navigation controls
  // ──────────────────────────────

  /** Container element for all search tabs (Individuals, Companies, etc.). */
  tabsContainer: '#defendantTabs',

  /** Tab button for "Individuals". */
  individualsTab: '#tab-individuals .govuk-tabs__tab',

  /** Wrapper list item for the "Companies" tab. */
  companiesTabItem: '#tab-companies',

  /** Tab button for "Companies". */
  companiesTab: '#tab-companies .govuk-tabs__tab',

  /** CSS class applied to the currently selected tab. */
  selectedTabClass: 'govuk-tabs__list-item--selected',

  /** Panel content area displayed when the Companies tab is active. */
  companiesPanel: 'opal-lib-govuk-tabs-panel#companies .govuk-tabs__panel',

  /** Tab button for "Minor Creditors". */
  minorCreditorsTab: '#tab-minor-creditors .govuk-tabs__tab',

  /** Tab button for "Major Creditors". */
  majorCreditorsTab: '#tab-major-creditors .govuk-tabs__tab',

  /** Angular component host for the Companies search form. */
  companiesFormHost: 'app-fines-sa-search-account-form-companies',

  // ──────────────────────────────
  // Companies search fields
  // ──────────────────────────────

  /** Company name input field. */
  companyNameInput: '#fsa_search_account_companies_company_name',

  /** Checkbox to enforce exact company name match. */
  companyNameExactMatchCheckbox: '#fsa_search_account_companies_company_name_exact_match',

  /** Checkbox to include aliases in company search. */
  includeAliasesCheckbox: '#fsa_search_account_companies_include_aliases',

  /** Address line 1 input field. */
  addressLine1Input: '#fsa_search_account_companies_address_line_1',

  /** Postcode input field. */
  postCodeInput: '#fsa_search_account_companies_post_code',

  // ──────────────────────────────
  // Global filters
  // ──────────────────────────────

  /** Checkbox to filter results by active accounts only. */
  activeAccountsOnlyCheckbox: '#fsa_search_account_active_accounts_only',

  // ──────────────────────────────
  // Actions
  // ──────────────────────────────

  /** Primary "Search" button to trigger the query. */
  searchButton: '#submitForm',
};
