import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS } from './fines-acc-history-and-notes-details-labels.constant';

import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_ASSOCIATED_RECORD_TYPES } from './fines-acc-history-and-notes-details-associated-record-types.constant';

export const FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_TRANSACTION_TEMPLATES = {
  simple: {
    CFEES: 'Court Fee',
    LIFEES: 'Licensing Fee',
    REPLIC: 'Repayment',
  },
  labelledReference: {
    BACS: {
      label: FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS.bacsPayment,
      referenceLabel: FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS.paymentReference,
    },
    CANCHQ: {
      label: 'Cheque cancelled',
      referenceLabel: 'Cheque number:',
    },
    RIBACS: {
      label: 'BACS payment reissued',
      referenceLabel: FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS.paymentReference,
    },
    RTBACS: {
      label: 'BACS payment cancelled',
      referenceLabel: FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS.paymentReference,
    },
  },
  cheque: {
    CHEQUE: FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS.chequeIssued,
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
  associatedRecordTypes: FINES_ACC_HISTORY_AND_NOTES_DETAILS_ASSOCIATED_RECORD_TYPES,
  chequeNumberLabel: 'Cheque number:',
  defaultChequeNumber: 'Not yet written',
  fallbackReferenceLabel: 'Reference:',
  statusLabels: {
    D: 'Cheque dishonoured',
    X: 'Cheque cancelled',
  },
} as const;
