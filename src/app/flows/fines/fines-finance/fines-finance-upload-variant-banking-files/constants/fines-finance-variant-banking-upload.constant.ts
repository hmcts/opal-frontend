/** Validation limits applied independently to each Variant Banking file selection. */
export const FINES_FINANCE_VARIANT_BANKING_UPLOAD = {
  acceptedTypes: ['.dat'],
  maxFiles: 6,
  maxFileSize: 2 * 1024 * 1024,
  filenamePattern: /^a121_\d{6}_VB_\d{3}_[A-Z]{2}\.dat$/i,
} as const;
