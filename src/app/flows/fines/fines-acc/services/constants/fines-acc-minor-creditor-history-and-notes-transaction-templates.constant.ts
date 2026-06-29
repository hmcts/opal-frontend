export const FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_TRANSACTION_TEMPLATES = {
  simple: {
    CFEES: 'Court Fee',
    LIFEES: 'Licensing Fee',
    REPLIC: 'Repayment',
  },
  labelledReference: {
    BACS: {
      label: 'BACS payment',
      referenceLabel: 'Payment reference:',
    },
    CANCHQ: {
      label: 'Cheque cancelled',
      referenceLabel: 'Cheque number:',
    },
    RIBACS: {
      label: 'BACS payment reissued',
      referenceLabel: 'Payment reference:',
    },
    RTBACS: {
      label: 'BACS payment cancelled',
      referenceLabel: 'Payment reference:',
    },
  },
  cheque: {
    CHEQUE: 'Cheque issued',
    RICHEQ: 'Cheque reissued',
  },
  defendantAccount: {
    MADJ: 'Manual adjustment',
    PAYMNT: 'Payment received',
  },
  creditorAccount: {
    REPAYC: 'Repayment',
    REPAYF: 'Repayment',
    REPAYM: 'Repayment',
    REPAYP: 'Repayment',
    REPAYV: 'Repayment',
    REPAYW: 'Repayment',
  },
  associatedRecord: {
    REPSUS: 'Repayment from suspense',
  },
  associatedValue: {
    XFER: 'Suspense transfer',
  },
  associatedRecordTypes: {
    creditorAccounts: 'creditor_accounts',
    defendantTransaction: 'defendant_transaction',
    suspenseItem: 'suspense_item',
  },
  chequeNumberLabel: 'Cheque number:',
  defaultChequeNumber: 'Not yet written',
  fallbackReferenceLabel: 'Reference:',
  statusLabels: {
    D: 'Cheque dishonoured',
    X: 'Cheque cancelled',
  },
} as const;
