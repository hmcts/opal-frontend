import { ITransformItem } from '@services/transformation-service/interfaces/transform-item.interface';

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
export const FINES_MAC_TRANSFORM_ITEMS_CONFIG: ITransformItem[] = [
  { key: 'dob', ...BUILD_PAYLOAD_FORMAT },
  { key: 'effective_date', ...BUILD_PAYLOAD_FORMAT },
  { key: 'collection_order_date', ...BUILD_PAYLOAD_FORMAT },
  { key: 'suspended_committal_date', ...BUILD_PAYLOAD_FORMAT },
  { key: 'account_sentence_date', ...BUILD_PAYLOAD_FORMAT },
  { key: 'response', ...BUILD_PAYLOAD_FORMAT },
];

// Reverse transformation configuration
export const FINES_MAC_MAP_TRANSFORM_ITEMS_CONFIG: ITransformItem[] = [
  { key: 'dob', ...MAP_PAYLOAD_FORMAT },
  { key: 'effective_date', ...MAP_PAYLOAD_FORMAT },
  { key: 'collection_order_date', ...MAP_PAYLOAD_FORMAT },
  { key: 'suspended_committal_date', ...MAP_PAYLOAD_FORMAT },
  { key: 'account_sentence_date', ...MAP_PAYLOAD_FORMAT },
  { key: 'response', ...MAP_PAYLOAD_FORMAT },
];
