import { THistoryDetailsTransformerConfig as TFinesAccHistoryAndNotesDetailsTransformerConfig } from '@hmcts/opal-frontend-common/services/history-transformation-service';
import {
  transformAmendmentDetails,
  transformEnforcementDetails,
  transformNoteDetails,
  transformPaymentTermsDetails,
  transformTransactionDetails,
} from '../utils/fines-acc-payload-transform-history-and-notes.utils';

export const FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS: TFinesAccHistoryAndNotesDetailsTransformerConfig = {
  amendment: transformAmendmentDetails,
  enforcement: transformEnforcementDetails,
  financial: transformTransactionDetails,
  note: transformNoteDetails,
  paymentterms: transformPaymentTermsDetails,
};
