import { IOpalFinesAddEnforcementActionPayload } from '@services/fines/opal-fines-service/interfaces/opal-fines-add-enforcement-action-payload.interface';

export const FINES_ACC_ENF_ACTION_ADD_PAYLOAD_MOCK: IOpalFinesAddEnforcementActionPayload = {
  result_id: 'REM',
  enforcement_result_responses: [{ parameter_name: 'reason', response: 'Reason entered' }],
};
