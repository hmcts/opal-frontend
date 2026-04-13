import { TRANSFORM_ITEM_DEFAULTS } from '@hmcts/opal-frontend-common/services/transformation-service/constants';
import { ITransformItem } from '@hmcts/opal-frontend-common/services/transformation-service/interfaces';

const FINES_SA_BUILD_PAYLOAD_DATE_FORMAT = {
  ...TRANSFORM_ITEM_DEFAULTS,
  transformType: 'date',
  dateConfig: {
    inputFormat: 'dd/MM/yyyy',
    outputFormat: 'yyyy-MM-dd',
  },
};

export const FINES_SA_BUILD_TRANSFORM_ITEMS_CONFIG: ITransformItem[] = [
  { key: 'fsa_search_account_individuals_date_of_birth', ...FINES_SA_BUILD_PAYLOAD_DATE_FORMAT },
];
