/**
 * @file draft-accounts-table.locators.ts
 * @description
 * Stable selectors for the **Create and Manage Draft Accounts** listings and
 * the View all rejected accounts page. Targets the shared sortable table
 * component so actions can remain selector-free.
 */
export const DraftAccountsTableLocators = {
  /** Root sortable table element */
  table: 'opal-lib-moj-sortable-table',
  /** All data rows rendered inside the sortable table */
  rows: 'opal-lib-moj-sortable-table tbody tr',
  /** Table headings (sortable header cells) */
  headings: 'opal-lib-moj-sortable-table th',
  /** Default page header on the draft listings */
  pageHeader: 'h1.govuk-heading-l',
  /** Tab heading rendered for the active sub-navigation */
  tabHeading: 'h2.govuk-heading-m',
  /** Back link used on View all rejected accounts */
  backLink: 'a.govuk-back-link',
  /** Inline link to open the View all rejected accounts page */
  viewAllRejectedLink: 'a.govuk-link:contains("view all rejected accounts")',
  cells: {
    accountLink: 'td#account a',
    defendantLink: 'td#defendant a',
    defendant: 'td#defendant',
    dateOfBirth: 'td#dob',
    createdDate: 'td#createdDate',
    changedDate: 'td#changedDate',
    accountType: 'td#accountType',
    businessUnit: 'td#businessUnit',
    submittedBy: 'td#submittedBy',
  },
  pagination: {
    container: 'nav.govuk-pagination',
    next: 'a.govuk-pagination__link--next, button.govuk-pagination__link--next',
    links: 'a.moj-pagination__link',
    activeItem: 'li.moj-pagination__item--active',
  },
} as const;
