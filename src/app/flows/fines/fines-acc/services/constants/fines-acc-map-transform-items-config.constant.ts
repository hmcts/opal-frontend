import { ITransformItem } from '@hmcts/opal-frontend-common/services/transformation-service/interfaces';
import { TRANSFORM_ITEM_DEFAULTS } from '@hmcts/opal-frontend-common/services/transformation-service/constants';

const MAP_PAYLOAD_DATE_FORMAT = {
  ...TRANSFORM_ITEM_DEFAULTS,
  transformType: 'date',
  dateConfig: {
    inputFormat: 'yyyy-MM-dd',
    outputFormat: 'dd/MM/yyyy',
  },
};

// Reverse transformation configuration
export const FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG: ITransformItem[] = [
  { key: 'date_of_birth', ...MAP_PAYLOAD_DATE_FORMAT },
  { key: 'effective_date', ...MAP_PAYLOAD_DATE_FORMAT },
  { key: 'last_movement_date', ...MAP_PAYLOAD_DATE_FORMAT },
  { key: 'date_days_in_default_imposed', ...MAP_PAYLOAD_DATE_FORMAT },
  { key: 'posted_date', ...MAP_PAYLOAD_DATE_FORMAT },
  { key: 'payment_card_last_requested', ...MAP_PAYLOAD_DATE_FORMAT },
  { key: 'date_notice_issued', ...MAP_PAYLOAD_DATE_FORMAT },
  { key: 'hearing_date', ...MAP_PAYLOAD_DATE_FORMAT },
];
