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
  processAllocatePage: '#fines-api-process-allocate-page',
  processAllocateBackLink: 'a.govuk-back-link',
  processTabLink: 'li[subnavitemid="fines-api-process-tab"] .moj-sub-navigation__link',
  allocateTabLink: 'li[subnavitemid="fines-api-allocate-tab"] .moj-sub-navigation__link',
  ignoredFilesTabLink: 'li[subnavitemid="fines-api-ignored-tab"] .moj-sub-navigation__link',
  processTabContent: '#fines-api-process-tab-content',
  processFilesEmptyHeading: '#fines-api-process-files-empty',
  processFilesEmptyDescription: '#fines-api-process-files-description-empty',
  processFilesTable: '#fines-api-process-tab-content table',
  processFilesHeading: '#fines-api-process-files-heading',
  processFilesSelectedCount: '#fines-api-process-files-selected-count',
  processFilesRefreshButton: '#fines-api-process-refresh',
  processFilesProcessButton: '#fines-api-process-submit',
  processFilesPagination: '#fines-api-process-files-pagination',
  processFilesSelectAllCheckbox: '#fines-api-process-files-select-all-checkbox',
  processFilesSelectionError: '#fines-api-process-files-error',
  processFileCheckbox: (interfaceFileId: number): string => `#fines-api-process-file-${interfaceFileId}`,
  processFileNameCells: '[id^="fines-api-process-file-"][id$="-name"]',
  processFileBusinessUnitCells: '[id^="fines-api-process-file-"][id$="-business-unit"]',
  processFilesTableHeadings: '#fines-api-process-tab-content thead th',
  processFileNameCell: (interfaceFileId: number): string => `#fines-api-process-file-${interfaceFileId}-name`,
  processFileSourceCell: (interfaceFileId: number): string => `#fines-api-process-file-${interfaceFileId}-source`,
  processFileBusinessUnitCell: (interfaceFileId: number): string =>
    `#fines-api-process-file-${interfaceFileId}-business-unit`,
  processFileDateUploadedCell: (interfaceFileId: number): string =>
    `#fines-api-process-file-${interfaceFileId}-date-uploaded`,
  processAllocateCancelLink: '#fines-api-process-allocate-cancel .govuk-link',
  confirmProcessPage: '#fines-api-confirm-process-page',
  confirmProcessHeading: '#fines-api-confirm-process-heading',
  confirmProcessSelectionCount: '#fines-api-confirm-process-selection-count',
  confirmProcessBusinessUnitsTable: '#fines-api-confirm-process-business-units',
  confirmProcessBusinessUnitSummaryRows: '#fines-api-confirm-process-business-units tbody tr',
  confirmProcessBusinessUnitSummaryNameCells:
    '#fines-api-confirm-process-business-units tbody [id^="fines-api-confirm-process-business-unit-"]',
  confirmProcessBusinessUnitCell: (businessUnitId: number): string =>
    `#fines-api-confirm-process-business-unit-${businessUnitId}`,
  confirmProcessFileCountCell: (businessUnitId: number): string =>
    `#fines-api-confirm-process-file-count-${businessUnitId}`,
  confirmProcessOverrideInhibitsSection: '#fines-api-confirm-process-override-inhibits',
  confirmProcessOverrideInhibitsRows: '#fines-api-confirm-process-override-inhibits tbody tr',
  confirmProcessOverrideInhibitsSelectAllCheckbox: '#fines-api-confirm-process-override-inhibits-select-all',
  confirmProcessOverrideInhibitsCheckbox: (interfaceFileId: number): string =>
    `#fines-api-confirm-process-override-inhibits-${interfaceFileId}`,
  confirmProcessOverrideInhibitsFileCell: (interfaceFileId: number): string =>
    `#fines-api-confirm-process-override-inhibits-file-${interfaceFileId}`,
  confirmProcessOverrideInhibitsBusinessUnitCell: (interfaceFileId: number): string =>
    `#fines-api-confirm-process-override-inhibits-business-unit-${interfaceFileId}`,
  confirmProcessProcessButton: '#fines-api-confirm-process-submit',
  confirmProcessCancelLink: '#fines-api-confirm-process-page a.govuk-link.button-link',
} as const;
