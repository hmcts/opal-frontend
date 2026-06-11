import { TRANSFORM_ITEM_DEFAULTS } from '@hmcts/opal-frontend-common/services/transformation-service/constants';
import { ITransformItem } from '@hmcts/opal-frontend-common/services/transformation-service/interfaces';

const BUILD_PAYLOAD_DATE_FORMAT = {
  ...TRANSFORM_ITEM_DEFAULTS,
  transformType: 'date',
  dateConfig: {
    inputFormat: 'dd/MM/yyyy',
    outputFormat: 'yyyy-MM-dd',
  },
};

export const FINES_ACC_HISTORY_FILTER_TRANSFORM_ITEMS_CONFIG: ITransformItem[] = [
  { key: 'dateFrom', ...BUILD_PAYLOAD_DATE_FORMAT },
  { key: 'dateTo', ...BUILD_PAYLOAD_DATE_FORMAT },
];
