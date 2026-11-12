export const FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_ACCOUNT_CONTENT = {
  consolidated: 'Account has been consolidated.',
  writtenOff: 'Account has been written off in full',
  zeroBalance: 'Account has a zero balance',
  inhibitedEnforcementAction: 'Account is subject to inhibit related enforcement actions:',
  transferredOut: 'Account has been transferred out',
  cannotPay: 'You cannot pay into this account',
  success: 'Confirm account',
  unavailable: 'Account details are not available',
} as const;

export const FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_ACCOUNT_RESTRICTED_STATUS_WARNINGS: Readonly<Record<string, string>> =
  {
    CS: FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_ACCOUNT_CONTENT.consolidated,
    WO: FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_ACCOUNT_CONTENT.writtenOff,
    TA: FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_ACCOUNT_CONTENT.transferredOut,
    TO: FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_ACCOUNT_CONTENT.transferredOut,
    TS: FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_ACCOUNT_CONTENT.transferredOut,
  };
