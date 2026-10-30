/**
 * Stable selectors for the Finance landing page.
 */
export const FinanceLocators = {
  cashHeading: 'h2',
  automaticCashInputLink: '#automaticCashInputLink',
  manualCashInputLink: '#manualCashInput',
  inboundFilesLink: '#finesFinanceInboundFilesLink',
  outboundFilesLink: '#finesFinanceOutboundFilesLink',
  uploadVariantBankingFilesLink: '#finesFinanceUploadVariantBankingFilesLink',
  labels: {
    cash: 'Cash',
    automaticCashInput: 'Automatic Cash Input',
    manualCashInput: 'Manual cash input',
    bankingInterfaces: 'External banking interfaces',
    inboundFiles: 'Inbound files',
    outboundFiles: 'Outbound files',
    uploadVariantBankingFiles: 'Upload variant banking files',
  },
} as const;

/** Stable selectors for the Manual Cash Input create-and-allocate screen. */
export const ManualCashInputLocators = {
  backLink: 'a.govuk-back-link',
  createTillButton: '#create-till-button',
  allocateButton: '#allocate-till-button',
  selectedCount: '#fines-mci-create-allocate-selected-count',
  table: 'app-fines-mci-create-allocate-table table',
  tableHeadings: 'app-fines-mci-create-allocate-table thead th',
  selectAllCheckbox: '#fines-mci-create-allocate-select-all-checkbox',
  tillCheckbox: (tillId: number | string): string => `#fines-mci-create-allocate-${tillId}`,
  tillNumberCell: (tillId: number | string): string => `#fines-mci-create-allocate-${tillId}-till-number`,
  tillNumberCells: '[id^="fines-mci-create-allocate-"][id$="-till-number"]',
  paymentsCell: (tillId: number | string): string => `#fines-mci-create-allocate-${tillId}-payments`,
  paymentsCells: '[id^="fines-mci-create-allocate-"][id$="-payments"]',
  errorMessage: '.govuk-error-message',
  amountCell: (tillId: number | string): string => `#fines-mci-create-allocate-${tillId}-amount`,
  businessUnitCell: (tillId: number | string): string => `#fines-mci-create-allocate-${tillId}-business-unit`,
  createdByCell: (tillId: number | string): string => `#fines-mci-create-allocate-${tillId}-created-by`,
  dateCreatedCell: (tillId: number | string): string => `#fines-mci-create-allocate-${tillId}-date-created`,
  selectBusinessUnitHeading: 'h1.govuk-heading-l',
  businessUnitInput: '#fmci_create_till_business_unit_id-autocomplete',
  businessUnitAutocomplete: '#fmci_create_till_business_unit_id-autocomplete__listbox',
  businessUnitError: '#fmci_create_till_business_unit_id-autocomplete-error-message',
  errorSummary: '.govuk-error-summary',
  singleBusinessUnitSummary: '#fines-mci-create-till-business-unit',
  continueButton: '#submitForm',
  cancelLink: 'a.govuk-link.button-link',
  tillDetails: '#fines-mci-create-till-details',
  tillDetailsBusinessUnitKey: '#fines-mci-till-details-summaryBusiness-unitKey',
  tillDetailsBusinessUnitValue: '#fines-mci-till-details-summaryBusiness-unitValue',
  addPaymentButton: '#fines-mci-add-payment',
  deleteTillLink: '#fines-mci-delete-till',
} as const;
