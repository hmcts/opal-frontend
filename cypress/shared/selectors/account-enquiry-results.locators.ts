/**
 * @file accountEnquiryResults.locators.ts
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
    /** The main page heading (e.g., “Search results”). */
    heading: 'h1.govuk-heading-l',

    /** Back link to return to the Account Search page. */
    backLink: 'a.govuk-back-link',
  },

  // ──────────────────────────────
  // No-results / message selectors
  // ──────────────────────────────

  /** No-results banner / message area (e.g. "There are no matching results"). */
  messages: {
    /** Heading that appears when there are no matching results. */
    noResultsHeading: 'h2.govuk-heading-m',

    /** "Check your search" link in the no-results paragraph. */
    checkYourSearchLink: 'p.govuk-body-m a.govuk-link',
  },

  // ──────────────────────────────
  // Table structure
  // ──────────────────────────────

  /** Root, head, body, and row selectors for the results table. */
  table: {
    /** Root table element inside its wrapper component. */
    root: 'table.govuk-table',

    /** Table head (sortable columns). */
    head: 'table.govuk-table thead',

    /** Table body containing all result rows. */
    body: 'table.govuk-table tbody',

    /** All visible result rows within the table body. */
    rows: 'table.govuk-table tbody > tr.govuk-table__row',
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
    ref: 'thead [columnkey="Ref"] button',
    enf: 'thead [columnkey="Enf"] button',
    balance: 'thead [columnkey="Balance"] button',
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

    /** Defendant name column. */
    name: 'td#defendantName',

    /** Aliases column (if present). */
    aliases: 'td#defendantAliases',

    /** Date of birth column. */
    dob: 'td#defendantDateOfBirth',

    /** Address line 1 column. */
    addr1: 'td#defendantAddressLine1',

    /** Postcode column. */
    postcode: 'td#defendantPostcode',

    /** National Insurance number column. */
    ni: 'td#defendantNationalInsuranceNumber',

    /** Parent or guardian column. */
    parentGuard: 'td#defendantParentOrGuardian',

    /** Business unit column. */
    businessUnit: 'td#defendantBusinessUnit',

    /** Reference column. */
    ref: 'td#defendantRef',

    /** Enforcement column. */
    enf: 'td#defendantEnf',

    /** Balance column. */
    balance: 'td#defendantBalance',
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
