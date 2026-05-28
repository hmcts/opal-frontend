import { IOpalFinesResultRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';
import { FINES_ACC_ENF_ACTION_ADD_FIELD_TYPE_ALIASES } from '../constants/fines-acc-enf-action-add-field-type-aliases.constant';
import { FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES } from '../constants/fines-acc-enf-action-add-field-types.constant';

export const FINES_ACC_ENF_ACTION_ADD_RESULT_MOCK = {
  result_id: 'COLLO',
  result_title: 'Collection order',
  allow_payment_terms: true,
  result_parameters: JSON.stringify([
    {
      name: 'reason',
      prompt: 'Reason',
      type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPE_ALIASES.text[1],
      mandatory: true,
      min: 1,
      max: 60,
      language_dependent: true,
    },
    {
      name: 'hearingdate',
      prompt: 'Hearing date',
      type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.date,
      mandatory: false,
      min: '1900-01-01',
      max: '2100-12-31',
      language_dependent: false,
    },
  ]),
} as IOpalFinesResultRefData;
