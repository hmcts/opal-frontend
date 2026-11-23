/** Stable selectors for the Variant Banking upload journey. */
export const VariantBankingUploadLocators = {
  heading: '#fines-finance-upload-heading',
  fileInput: '#files',
  dropZone: '.moj-multi-file-upload__dropzone',
  fileList: '.moj-multi-file-upload__list',
  fileName: '.moj-multi-file-upload__filename',
  successIcon: '.moj-multi-file-upload__success',
  errorIcon: '.moj-multi-file-upload__error',
  viewInboundFiles: '#fines-finance-upload-view-files',
  errorSummary: '.govuk-error-summary',
} as const;
