/**
 * Stable selectors for the Automatic Cash Input journey.
 */
export const AutomaticCashInputLocators = {
  heading: 'h1',
  selectBusinessUnitsLegend: 'legend',
  table: 'table',
  tableHeadings: 'thead th',
  selectAllCheckbox: '#fines-api-select-business-units',
  businessUnitCheckbox: (businessUnitId: number): string => `#fines-api-business-unit-${businessUnitId}`,
  businessUnitSelectionError: '#fines-api-select-business-units-error',
  errorSummary: '.govuk-error-summary',
  errorSummaryTitle: '.govuk-error-summary__title',
  businessUnitNameCells: '[id^="fines-api-business-unit-name-"]',
  businessUnitNameCell: (businessUnitId: number): string => `#fines-api-business-unit-name-${businessUnitId}`,
  businessUnitFileCountCell: (businessUnitId: number): string =>
    `#fines-api-business-unit-file-count-${businessUnitId}`,
  businessUnitTillCountCell: (businessUnitId: number): string =>
    `#fines-api-business-unit-till-count-${businessUnitId}`,
  continueButton: '#fines-api-select-business-units-continue',
  cancelLink: 'a.govuk-link.button-link',
} as const;
