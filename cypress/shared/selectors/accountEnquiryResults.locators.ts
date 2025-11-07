// cypress/shared/selectors/accountEnquiryResults.locators.ts

/**
 * Account Enquiry – Results table (Search results)
 *
 * Notes:
 * - IDs like "defendantName" are repeated per row, so always scope by row.
 * - Prefer row-scoped selectors (e.g., row().find(Locators.cols.name)).
 */
export const AccountEnquiryResultsLocators = {
  // Page-level
  page: {
    heading: 'h1.govuk-heading-l', // "Search results"
    backLink: 'a.govuk-back-link',
  },

  // Table
  table: {
    root: 'app-fines-sa-results-defendant-table-wrapper table.govuk-table',
    head: 'app-fines-sa-results-defendant-table-wrapper table.govuk-table thead',
    body: 'app-fines-sa-results-defendant-table-wrapper table.govuk-table tbody',
    rows: 'app-fines-sa-results-defendant-table-wrapper table.govuk-table tbody > tr.govuk-table__row',
  },

  // Column headers (sortable buttons) – addressed by their columnkey
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

  /**
   * Row-scoped cell selectors.
   * Use like: cy.get(Loc.table.rows).first().find(Loc.cols.name)
   */
  cols: {
    accountLink: 'td#defendantAccountNumber a.govuk-link', // clickable account number
    accountCell: 'td#defendantAccountNumber', // cell root if you need the TD
    name: 'td#defendantName',
    aliases: 'td#defendantAliases',
    dob: 'td#defendantDateOfBirth',
    addr1: 'td#defendantAddressLine1',
    postcode: 'td#defendantPostcode',
    ni: 'td#defendantNationalInsuranceNumber',
    parentGuard: 'td#defendantParentOrGuardian',
    businessUnit: 'td#defendantBusinessUnit',
    ref: 'td#defendantRef',
    enf: 'td#defendantEnf',
    balance: 'td#defendantBalance',
  },

  /**
   * Convenience helpers (string selectors only).
   * Example usage:
   *   cy.get(AccountEnquiryResultsLocators.table.rows)
   *     .filter(AccountEnquiryResultsLocators.rowWithSurname('AccDetailSurname'))
   *     .first()
   *     .find(AccountEnquiryResultsLocators.cols.accountLink)
   *     .click();
   */
  rowWithSurname: (surname: string) => `:has(td#defendantName:contains("${surname}"))`,
  rowWithAccount: (accountNo: string) => `:has(td#defendantAccountNumber a:contains("${accountNo}"))`,

  /**
   * Dynamic selector for a results-table link by account number text.
   * Example usage:
   *   cy.get(AccountEnquiryResultsLocators.linkByAccountNumber('25000001E')).click();
   */
  linkByAccountNumber: (accountNumber: string) =>
    `app-fines-sa-results-defendant-table-wrapper a.govuk-link:contains("${accountNumber}")`,
};
