/**
 * @file account.impositions.details.locators.ts
 * @description Stable selectors for the defendant account Impositions tab.
 */

export const AccountImpositionsDetailsLocators = {
  root: 'app-fines-acc-defendant-details-impositions-tab',
  heading: 'app-fines-acc-defendant-details-impositions-tab h2',
  emptyState: 'app-fines-acc-defendant-details-impositions-tab p.govuk-body',
  tableHeadings: 'app-fines-acc-defendant-details-impositions-tab th',
  tableRows: 'app-fines-acc-defendant-details-impositions-tab tbody tr',
  dateAdded: (rowIndex: number) => `#imposition-date-added-${rowIndex}`,
  result: (rowIndex: number) => `#imposition-result-${rowIndex}`,
  creditor: (rowIndex: number) => `#imposition-creditor-${rowIndex}`,
  imposedAmount: (rowIndex: number) => `#imposition-imposed-amount-${rowIndex}`,
  paidAmount: (rowIndex: number) => `#imposition-paid-amount-${rowIndex}`,
  balance: (rowIndex: number) => `#imposition-balance-${rowIndex} span:not(.govuk-visually-hidden)`,
  dateImposed: (rowIndex: number) => `#imposition-date-imposed-${rowIndex}`,
  offence: (rowIndex: number) => `#imposition-offence-${rowIndex}`,
  imposedBy: (rowIndex: number) => `#imposition-imposed-by-${rowIndex}`,
  impositionId: (rowIndex: number) => `#imposition-id-${rowIndex}`,
};
