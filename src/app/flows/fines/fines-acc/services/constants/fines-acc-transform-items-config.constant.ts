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

const MAP_PAYLOAD_DATE_FORMAT = {
  ...TRANSFORM_ITEM_DEFAULTS,
  transformType: 'date',
  dateConfig: {
    inputFormat: 'yyyy-MM-dd',
    outputFormat: 'dd/MM/yyyy',
  },
};

// Forward transformation configuration
export const FINES_ACC_BUILD_TRANSFORM_ITEMS_CONFIG: ITransformItem[] = [
  { key: 'date_of_birth', ...BUILD_PAYLOAD_DATE_FORMAT },
];

// Reverse transformation configuration
export const FINES_ACC_MAP_TRANSFORM_ITEMS_CONFIG: ITransformItem[] = [
  { key: 'date_of_birth', ...MAP_PAYLOAD_DATE_FORMAT },
];
