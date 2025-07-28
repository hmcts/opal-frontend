import { ITransformItem } from '@hmcts/opal-frontend-common/services/transformation-service/interfaces';

// Shared properties
const BUILD_PAYLOAD_DATE_FORMAT = {
  transformType: 'date',
  dateConfig: {
    inputFormat: 'dd/MM/yyyy',
    outputFormat: 'yyyy-MM-dd',
  },
};

const MAP_PAYLOAD_DATE_FORMAT = {
  transformType: 'date',
  dateConfig: {
    inputFormat: 'yyyy-MM-dd',
    outputFormat: 'dd/MM/yyyy',
  },
};

const BUILD_PAYLOAD_TIME_FORMAT = {
  transformType: 'time',
  timeConfig: {
    addOffset: true,
  },
};

const MAP_PAYLOAD_TIME_FORMAT = {
  transformType: 'time',
  timeConfig: {
    addOffset: false,
  },
};

// Forward transformation configuration
export const FINES_MAC_BUILD_TRANSFORM_ITEMS_CONFIG: ITransformItem[] = [
  { key: 'dob', ...BUILD_PAYLOAD_DATE_FORMAT },
  { key: 'effective_date', ...BUILD_PAYLOAD_DATE_FORMAT },
  { key: 'collection_order_date', ...BUILD_PAYLOAD_DATE_FORMAT },
  { key: 'suspended_committal_date', ...BUILD_PAYLOAD_DATE_FORMAT },
  { key: 'account_sentence_date', ...BUILD_PAYLOAD_DATE_FORMAT },
  { key: 'date_of_sentence', ...BUILD_PAYLOAD_DATE_FORMAT },
  { key: 'response', ...BUILD_PAYLOAD_DATE_FORMAT },
  { key: 'time_of_issue', ...BUILD_PAYLOAD_TIME_FORMAT },
  { key: 'date_of_issue', ...BUILD_PAYLOAD_DATE_FORMAT },
];

// Reverse transformation configuration
export const FINES_MAC_MAP_TRANSFORM_ITEMS_CONFIG: ITransformItem[] = [
  { key: 'dob', ...MAP_PAYLOAD_DATE_FORMAT },
  { key: 'effective_date', ...MAP_PAYLOAD_DATE_FORMAT },
  { key: 'collection_order_date', ...MAP_PAYLOAD_DATE_FORMAT },
  { key: 'suspended_committal_date', ...MAP_PAYLOAD_DATE_FORMAT },
  { key: 'account_sentence_date', ...MAP_PAYLOAD_DATE_FORMAT },
  { key: 'date_of_sentence', ...MAP_PAYLOAD_DATE_FORMAT },
  { key: 'response', ...MAP_PAYLOAD_DATE_FORMAT },
  { key: 'time_of_issue', ...MAP_PAYLOAD_TIME_FORMAT },
  { key: 'date_of_issue', ...MAP_PAYLOAD_DATE_FORMAT },
];
