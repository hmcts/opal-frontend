import { THistoryDetailsTransformerConfig as TFinesAccHistoryAndNotesDetailsTransformerConfig } from '@hmcts/opal-frontend-common/services/history-transformation-service';
import {
  transformMinorCreditorAmendmentDetails,
  transformMinorCreditorGeneratedOrderAndNoticeDetails,
  transformMinorCreditorNoteDetails,
  transformMinorCreditorTransactionDetails,
} from '../utils/fines-acc-payload-transform-minor-creditor-history-and-notes.utils';

export const FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS: TFinesAccHistoryAndNotesDetailsTransformerConfig =
  {
    amendment: transformMinorCreditorAmendmentDetails,
    amendments: transformMinorCreditorAmendmentDetails,
    note: transformMinorCreditorNoteDetails,
    notes: transformMinorCreditorNoteDetails,
    transaction: transformMinorCreditorTransactionDetails,
    transactions: transformMinorCreditorTransactionDetails,
    financial: transformMinorCreditorTransactionDetails,
    generatedorderandnotice: transformMinorCreditorGeneratedOrderAndNoticeDetails,
    generatedordersandnotices: transformMinorCreditorGeneratedOrderAndNoticeDetails,
    documentinstance: transformMinorCreditorGeneratedOrderAndNoticeDetails,
    documentinstances: transformMinorCreditorGeneratedOrderAndNoticeDetails,
  };
