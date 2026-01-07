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
export const FINES_MAC_MAP_TRANSFORM_ITEMS_CONFIG: ITransformItem[] = [
  { key: 'dob', ...MAP_PAYLOAD_DATE_FORMAT },
  { key: 'effective_date', ...MAP_PAYLOAD_DATE_FORMAT },
  { key: 'collection_order_date', ...MAP_PAYLOAD_DATE_FORMAT },
  { key: 'suspended_committal_date', ...MAP_PAYLOAD_DATE_FORMAT },
  { key: 'account_sentence_date', ...MAP_PAYLOAD_DATE_FORMAT },
  { key: 'date_of_sentence', ...MAP_PAYLOAD_DATE_FORMAT },
  { key: 'response', ...MAP_PAYLOAD_DATE_FORMAT },
  { key: 'date_of_issue', ...MAP_PAYLOAD_DATE_FORMAT },
];
