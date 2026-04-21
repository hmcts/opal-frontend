export const AccountResultsLocators = {
  // Results headings and actions
  messageHeading: 'h2.govuk-heading-m',
  addToListButton: 'button.govuk-button[type="button"]',
  selectedAccountsHint: 'p.govuk-hint',
  invalidResultsBody: 'p.govuk-body-m',
  invalidResultsLink: 'p.govuk-body-m a.govuk-link',

  // Results table
  resultsTable: 'table.govuk-table',
  resultsTableHeaders: 'table.govuk-table thead th',
  resultsTableNamedHeaders: 'table.govuk-table thead th[opal-lib-moj-sortable-table-header]',
  resultsScrollPane: 'opal-lib-custom-horizontal-scroll-pane',
  resultsPagination: 'opal-lib-moj-pagination, .govuk-pagination, nav.govuk-pagination',
  resultsTableBody: 'table.govuk-table tbody',
  resultsRows: 'table.govuk-table tbody > tr.govuk-table__row',
  resultSelectionCheckboxes: 'table.govuk-table input[type="checkbox"]',
  resultSelectAllCheckbox: '#defendants-select-all-checkbox',
  resultAccountLink: 'td#defendantAccountNumber a.govuk-link',
  resultNameCell: 'td#defendantName',
  resultAliasesCell: 'td#defendantAliases',
  resultDateOfBirthCell: 'td#defendantDateOfBirth',
  resultAddressLine1Cell: 'td#defendantAddressLine1',
  resultPostcodeCell: 'td#defendantPostcode',
  resultCollectionOrderCell: 'td#defendantCollectionOrder',
  resultEnforcementCell: 'td#defendantEnforcement',
  resultBalanceCell: 'td#defendantBalance',
  resultPayingParentGuardianCell: 'td#defendantPayingParentGuardian',
  resultNationalInsuranceNumberCell: 'td#defendantNationalInsuranceNumber',
  resultRefCell: 'td#defendantRef',
  resultChecksBulletItems: 'ul.defendant-check-message-list > li',
  resultTableRow: 'tr.govuk-table__row',
  addToListErrorMessage: '#defendants-select-all-error-message',

  // Results row helpers
  resultRowWithAccount: (accountNumber: string) =>
    `tr.govuk-table__row:has(td#defendantAccountNumber a:contains("${accountNumber}"))`,
  resultAccountLinkByNumber: (accountNumber: string) =>
    `td#defendantAccountNumber a.govuk-link:contains("${accountNumber}")`,
  resultChecksCellByAccountId: (accountId: number | string) => `#defendant-checks-${accountId}`,
  resultRowCheckboxByAccountId: (accountId: number | string) => `#defendant-select-${accountId}`,
};
