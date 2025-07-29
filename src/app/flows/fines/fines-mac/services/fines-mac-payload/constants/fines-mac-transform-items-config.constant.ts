import { ITransformItem } from '@hmcts/opal-frontend-common/services/transformation-service/interfaces';

// Shared properties
const BUILD_PAYLOAD_FORMAT = {
  transformType: 'date',
  dateInputFormat: 'dd/MM/yyyy',
  dateOutputFormat: 'yyyy-MM-dd',
};

const MAP_PAYLOAD_FORMAT = {
  transformType: 'date',
  dateInputFormat: 'yyyy-MM-dd',
  dateOutputFormat: 'dd/MM/yyyy',
};

// Forward transformation configuration
export const FINES_MAC_BUILD_TRANSFORM_ITEMS_CONFIG: ITransformItem[] = [
  { key: 'dob', ...BUILD_PAYLOAD_FORMAT },
  { key: 'effective_date', ...BUILD_PAYLOAD_FORMAT },
  { key: 'collection_order_date', ...BUILD_PAYLOAD_FORMAT },
  { key: 'suspended_committal_date', ...BUILD_PAYLOAD_FORMAT },
  { key: 'account_sentence_date', ...BUILD_PAYLOAD_FORMAT },
  { key: 'response', ...BUILD_PAYLOAD_FORMAT },
  { key: 'date_of_sentence', ...BUILD_PAYLOAD_FORMAT },
];

// Reverse transformation configuration
export const FINES_MAC_MAP_TRANSFORM_ITEMS_CONFIG: ITransformItem[] = [
  { key: 'dob', ...MAP_PAYLOAD_FORMAT },
  { key: 'effective_date', ...MAP_PAYLOAD_FORMAT },
  { key: 'collection_order_date', ...MAP_PAYLOAD_FORMAT },
  { key: 'suspended_committal_date', ...MAP_PAYLOAD_FORMAT },
  { key: 'account_sentence_date', ...MAP_PAYLOAD_FORMAT },
  { key: 'response', ...MAP_PAYLOAD_FORMAT },
  { key: 'date_of_sentence', ...MAP_PAYLOAD_FORMAT },
];
