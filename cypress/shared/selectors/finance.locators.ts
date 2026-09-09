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
