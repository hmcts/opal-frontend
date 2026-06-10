import { IOpalFinesResultRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';
import { FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_RESULT_MOCK } from './fines-acc-payload-enforcement-action-add-result.mock';

export const FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_PAYMENT_TERMS_DISABLED_RESULT_MOCK = {
  ...FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_RESULT_MOCK,
  result_id: 'REM',
  allow_payment_terms: false,
} as IOpalFinesResultRefData;
