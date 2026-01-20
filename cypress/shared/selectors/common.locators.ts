/**
 * @file common.locators.ts
 * @description
 * App-wide, reusable selectors for shared UI elements (header, breadcrumbs, etc.).
 */
export const CommonLocators = {
  /** Primary page header. Prefer a stable test id if available. */
  header: '[data-testid="page-header"], h1[class*="govuk-heading"], h1',
  /** Standard GOV.UK page heading used across MAC flows. */
  pageHeader: 'h1.govuk-heading-l',

  /** Logical identifier for the unsaved changes confirmation dialog.
   *  Usage: `cy.on(commonLocators.unsavedChangesDialog, (msg) => { ... })` */
  unsavedChangesDialog: 'window:confirm', // not an element selector — used for logging

  /**
   * Global HMCTS header link (organisation name) that routes back to the
   * application root ("/"). Used by flows that "return to the dashboard"
   * via the HMCTS link.
   */
  hmctsHomeLink: 'a.moj-header__link--organisation-name[href="/"]',
  /** Service name link in the global header (e.g., "Opal"). */
  serviceNameLink: 'a.moj-header__link--service-name',

  /** Pagination "Next" link used in tables/lists that paginate. */
  paginationNext: '.moj-pagination__item--next a',
  /** Disabled pagination item (used to detect end of pagination). */
  paginationDisabledItem: '.moj-pagination__item--disabled',
} as const;

export type CommonLocatorKey = keyof typeof CommonLocators;
