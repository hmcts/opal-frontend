export const FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_ACCOUNT_CONTENT = {
  consolidated: 'You cannot pay into this account \u2013 Account has been consolidated',
  writtenOff: 'You cannot pay into this account \u2013 Account has been written off',
  zeroBalance: 'You cannot pay into this account \u2013 Account has a zero balance',
  inhibitedEnforcementAction: 'You cannot pay into this account \u2013 Account has an inhibited enforcement action',
  transferredOut: 'You cannot pay into this account \u2013 Account has been transferred out',
  transferOutInProgress: 'You cannot pay into this account \u2013 Transfer out in progress',
  transferredToScotlandOrNorthernIreland:
    'You cannot pay into this account \u2013 Account has been transferred out to Scotland or Northern Ireland',
  success: 'Successful confirm account',
  unavailable: 'Account details are not available',
  placeholder: 'Placeholder page. This page will be fully implemented under ticket PO-3530.',
} as const;

export const FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_ACCOUNT_RESTRICTED_STATUS_HEADINGS: Readonly<Record<string, string>> =
  {
    CS: FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_ACCOUNT_CONTENT.consolidated,
    WO: FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_ACCOUNT_CONTENT.writtenOff,
    TA: FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_ACCOUNT_CONTENT.transferredOut,
    TO: FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_ACCOUNT_CONTENT.transferOutInProgress,
    TS: FINES_MCI_PAYMENT_CATEGORY_CRIMINAL_ACCOUNT_CONTENT.transferredToScotlandOrNorthernIreland,
  };
