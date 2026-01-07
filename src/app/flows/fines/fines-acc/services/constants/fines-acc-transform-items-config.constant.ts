import { ITransformItem } from '@hmcts/opal-frontend-common/services/transformation-service/interfaces';
import { TRANSFORM_ITEM_DEFAULTS } from '@hmcts/opal-frontend-common/services/transformation-service/constants';

// Shared properties
const BUILD_PAYLOAD_DATE_FORMAT = {
  ...TRANSFORM_ITEM_DEFAULTS,
  transformType: 'date',
  dateConfig: {
    inputFormat: 'dd/MM/yyyy',
    outputFormat: 'yyyy-MM-dd',
  },
};

// Forward transformation configuration
export const FINES_ACC_BUILD_TRANSFORM_ITEMS_CONFIG: ITransformItem[] = [
  { key: 'date_of_birth', ...BUILD_PAYLOAD_DATE_FORMAT },
  { key: 'effective_date', ...BUILD_PAYLOAD_DATE_FORMAT },
  { key: 'last_movement_date', ...BUILD_PAYLOAD_DATE_FORMAT },
  { key: 'date_days_in_default_imposed', ...BUILD_PAYLOAD_DATE_FORMAT },
  { key: 'posted_date', ...BUILD_PAYLOAD_DATE_FORMAT },
  { key: 'payment_card_last_requested', ...BUILD_PAYLOAD_DATE_FORMAT },
  { key: 'date_notice_issued', ...BUILD_PAYLOAD_DATE_FORMAT },
];
