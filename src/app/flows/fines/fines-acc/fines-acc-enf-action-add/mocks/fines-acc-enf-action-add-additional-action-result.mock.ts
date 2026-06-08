import { IOpalFinesResultRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';
import { OPAL_FINES_RESULT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-result-ref-data.mock';

export const FINES_ACC_ENF_ACTION_ADD_ADDITIONAL_ACTION_RESULT_MOCK = {
  ...structuredClone(OPAL_FINES_RESULT_REF_DATA_MOCK),
  allow_payment_terms: true,
  allow_additional_action: true,
} as IOpalFinesResultRefData;
