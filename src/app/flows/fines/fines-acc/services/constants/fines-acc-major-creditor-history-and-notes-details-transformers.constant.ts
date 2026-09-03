import { THistoryDetailsTransformerConfig } from '@hmcts/opal-frontend-common/services/history-transformation-service';
import { transformMajorCreditorTransactionDetails } from '../utils/fines-acc-payload-transform-major-creditor-history-and-notes.utils';

export const FINES_ACC_MAJOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_TRANSFORMERS: THistoryDetailsTransformerConfig = {
  financial: transformMajorCreditorTransactionDetails,
};
