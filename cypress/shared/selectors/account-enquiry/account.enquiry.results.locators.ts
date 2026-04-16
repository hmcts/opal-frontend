/**
 * @file account.enquiry.results.locators.ts
 * @description
 * Selector map for the **Account Enquiry – Search Results Table**.
 * Defines reusable, scoped locators for page headings, table regions,
 * sortable headers, and per-row data cells.
 *
 * @remarks
 * - Always scope selectors by row — many IDs (e.g., `#defendantName`) repeat per record.
 * - Designed for use with Cypress `within()` or chained `.find()` calls in
 *   ResultsActions, AccountEnquiryFlow, and related test utilities.
 * - Provides dynamic selector helpers for row matching and account-specific links.
 *
 * @example
 * ```ts
 * // Click first result’s account link
 * cy.get(AccountEnquiryResultsLocators.table.rows)
 *   .first()
 *   .find(AccountEnquiryResultsLocators.cols.accountLink)
 *   .click();
 * ```
 *
 * @see {@link ResultsActions}
 */

export const AccountEnquiryResultsLocators = {
  // ──────────────────────────────
  // Page-level selectors
  // ──────────────────────────────

  /** Elements that exist at the page level (outside the table). */
  page: {
    /** The main page heading (for example, "Search results"). */
    heading: 'h1.govuk-heading-l',

    /** Back-link component host rendered above the results heading. */
    backLinkHost: 'opal-lib-govuk-back-link',

    /** Back link anchor rendered inside the GOV.UK back-link component. */
    backLink: 'a.govuk-back-link',
  },

  // ──────────────────────────────
  // No-results / message selectors
  // ──────────────────────────────

  /** No-results banner / message area (e.g. "There are no matching results"). */
  messages: {
    /** Heading that appears when there are no matching results. */
    noResultsHeading: 'h2.govuk-heading-m',

    /** Paragraph text shown in the no-results state. */
    noResultsText: 'p.govuk-body-m',

    /** "Check your search" link in the no-results paragraph. */
    checkYourSearchLink: 'p.govuk-body-m a.govuk-link',

    /** Heading that appears when the results exceed the supported threshold. */
    tooManyResultsHeading: 'h2.govuk-heading-m',

    /** Paragraph text shown in the too-many-results state. */
    tooManyResultsText: 'p.govuk-body-m',

    /** "Try adding more information" link in the too-many-results paragraph. */
    addMoreInfoLink: 'p.govuk-body-m a.govuk-link',
  },

  // ──────────────────────────────
  // Multi-result tabs
  // ──────────────────────────────

  /** Tabs rendered when the search returns multiple result types. */
  tabs: {
    /** Results tabset container. */
    container: 'opal-lib-govuk-tabs, #resultTypes',

    /** GOV.UK list wrapping all result-type tabs. */
    list: '.govuk-tabs__list',

    /** Individuals results tab. */
    individualsTab: '[tabitemid="tab-individuals"]',

    /** Companies results tab. */
    companiesTab: '[tabitemid="tab-companies"]',

    /** Minor creditors results tab. */
    minorCreditorsTab: '[tabitemid="tab-minor-creditors"]',

    /** Individuals tab panel. */
    individualsPanel: '#individuals',

    /** Companies tab panel. */
    companiesPanel: '#companies',

    /** Minor creditors tab panel. */
    minorCreditorsPanel: '#minorCreditors',
  },

  // ──────────────────────────────
  // Table structure
  // ──────────────────────────────

  /** Root, head, body, and row selectors for the results table. */
  table: {
    /** Root results wrapper for defendant/company result tables. */
    root: 'app-fines-sa-results-defendant-table-wrapper, app-fines-sa-results-minor-creditor-table-wrapper',

    /** Sortable table host rendered inside the results wrapper. */
    sortableTable: 'opal-lib-moj-sortable-table',

    /** Header cells rendered by the sortable table component. */
    head: 'opal-lib-moj-sortable-table th[opal-lib-moj-sortable-table-header]',

    /** Row container elements rendered by the sortable table component. */
    body: 'opal-lib-moj-sortable-table tr[opal-lib-moj-sortable-table-row]',

    /** All visible result rows within the rendered results wrapper. */
    rows: 'opal-lib-moj-sortable-table tr[opal-lib-moj-sortable-table-row]',
  },

  // ──────────────────────────────
  // Column header selectors
  // ──────────────────────────────

  /** Sortable column header buttons, keyed by their `columnkey` attribute. */
  headers: {
    account: 'thead [columnkey="Account"] button',
    name: 'thead [columnkey="Name"] button',
    aliases: 'thead [columnkey="Aliases"] button',
    dob: 'thead [columnkey="Date of birth"] button',
    addr1: 'thead [columnkey="Address line 1"] button',
    postcode: 'thead [columnkey="Postcode"] button',
    ni: 'thead [columnkey="NI number"] button',
    pg: 'thead [columnkey="Parent or guardian"] button',
    bu: 'thead [columnkey="Business unit"] button',
    defendant: 'thead [columnkey="Defendant"] button',
    ref: 'thead [columnkey="Ref"] button',
    enf: 'thead [columnkey="Enf"] button',
    balance: 'thead [columnkey="Balance"] button',
  },

  /** Header-cell selectors keyed by their visible column. */
  headerCells: {
    account: 'th[columnkey="Account"]',
    name: 'th[columnkey="Name"]',
    aliases: 'th[columnkey="Aliases"]',
    dob: 'th[columnkey="Date of birth"]',
    addr1: 'th[columnkey="Address line 1"]',
    postcode: 'th[columnkey="Postcode"]',
    ni: 'th[columnkey="NI number"]',
    pg: 'th[columnkey="Parent or guardian"]',
    bu: 'th[columnkey="Business unit"]',
    defendant: 'th[columnkey="Defendant"]',
    ref: 'th[columnkey="Ref"]',
    enf: 'th[columnkey="Enf"]',
    balance: 'th[columnkey="Balance"]',
  },

  // ──────────────────────────────
  // Pagination
  // ──────────────────────────────
  pagination: {
    /** Pagination component root. */
    root: 'opal-lib-moj-pagination',

    /** Visible pagination results summary text. */
    resultsText: '.moj-pagination__results',

    /** Previous-page control. */
    previousButton: '.govuk-pagination__prev a.govuk-pagination__link',

    /** Next-page control wrapper. */
    nextButton: '.govuk-pagination__next a.govuk-pagination__link',

    /** List container for numbered pagination items. */
    list: '.govuk-pagination__list',

    /** Individual numbered pagination item. */
    listItem: '.govuk-pagination__item',

    /** Ellipsis item rendered in condensed pagination layouts. */
    listItemEllipses: '.govuk-pagination__item--ellipses',

    /** Currently selected page number. */
    currentPage: '.govuk-pagination__item--current',

    /**
     * Dynamic selector for a visible page-number item.
     * @param pageNum - Visible page number text.
     * @returns Selector for the pagination item matching the provided page number.
     */
    pageNumber: (pageNum: number | string) =>
      `.govuk-pagination__item a.govuk-pagination__link:contains("${pageNum}"), .govuk-pagination__item--current:contains("${pageNum}")`,

    next: 'nav.govuk-pagination .govuk-pagination__next a.govuk-pagination__link',
  },

  // ──────────────────────────────
  // Row-level cell selectors
  // ──────────────────────────────

  /**
   * Row-scoped cell selectors.
   * Use like:
   * ```ts
   * cy.get(AccountEnquiryResultsLocators.table.rows)
   *   .first()
   *   .find(AccountEnquiryResultsLocators.cols.name)
   * ```
   */
  cols: {
    /** Clickable account link cell (anchors only). */
    accountLink: 'td#defendantAccountNumber a.govuk-link',

    /** TD element for the account cell, if text extraction is needed. */
    accountCell: 'td#defendantAccountNumber',

    /** Minor creditor clickable account link cell (anchors only). */
    minorCreditorAccountLink: 'td#minorCreditorAccountNumber a.govuk-link',

    /** TD element for the minor creditor account cell, if text extraction is needed. */
    minorCreditorAccountCell: 'td#minorCreditorAccountNumber',

    /** Defendant name column. */
    name: 'td#defendantName',

    /** Minor creditor name column. */
    minorCreditorName: 'td#minorCreditorName',

    /** Aliases column (if present). */
    aliases: 'td#defendantAliases',

    /** Date of birth column. */
    dob: 'td#defendantDateOfBirth',

    /** Address line 1 column. */
    addr1: 'td#defendantAddressLine1',

    /** Minor creditor address line 1 column. */
    minorCreditorAddr1: 'td#minorCreditorAddressLine1',

    /** Postcode column. */
    postcode: 'td#defendantPostcode',

    /** Minor creditor postcode column. */
    minorCreditorPostcode: 'td#minorCreditorPostcode',

    /** National Insurance number column. */
    ni: 'td#defendantNationalInsuranceNumber',

    /** Parent or guardian column. */
    parentGuard: 'td#defendantParentOrGuardian',

    /** Business unit column. */
    businessUnit: 'td#defendantBusinessUnit',

    /** Minor creditor business unit column. */
    minorCreditorBusinessUnit: 'td#minorCreditorBusinessUnit',

    /** Reference column. */
    ref: 'td#defendantRef',

    /** Enforcement column. */
    enf: 'td#defendantEnf',

    /** Balance column. */
    balance: 'td#defendantBalance',

    /** Minor creditor linked defendant column. */
    minorCreditorDefendant: 'td#minorCreditorDefendant',

    /** Minor creditor balance column. */
    minorCreditorBalance: 'td#minorCreditorBalance',
  },

  // ──────────────────────────────
  // Convenience string selectors
  // ──────────────────────────────

  /**
   * Filters for rows containing a given surname.
   * @param surname - Visible defendant surname text.
   * @returns Selector that narrows rows to those containing the surname.
   * @example
   * ```ts
   * cy.get(AccountEnquiryResultsLocators.table.rows)
   *   .filter(AccountEnquiryResultsLocators.rowWithSurname('Smith'));
   * ```
   */
  rowWithSurname: (surname: string) => `:has(td#defendantName:contains("${surname}"))`,

  /**
   * Filters for rows containing a specific account number.
   * @param accountNo - Visible account number text.
   * @returns Selector that narrows rows to those containing the account number.
   */
  rowWithAccount: (accountNo: string) => `:has(td#defendantAccountNumber a:contains("${accountNo}"))`,

  /**
   * Builds a dynamic selector for a clickable account link by its visible text.
   * @param accountNumber - Account number text displayed in the link.
   * @returns Selector for the account link matching the provided number.
   * @example
   * ```ts
   * cy.get(AccountEnquiryResultsLocators.linkByAccountNumber('25000001E')).click();
   * ```
   */
  linkByAccountNumber: (accountNumber: string) =>
    `app-fines-sa-results-defendant-table-wrapper a.govuk-link:contains("${accountNumber}")`,
};
