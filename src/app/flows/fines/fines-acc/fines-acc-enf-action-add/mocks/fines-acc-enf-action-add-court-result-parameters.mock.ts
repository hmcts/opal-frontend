import { FINES_ACC_ENF_ACTION_ADD_API_DATA_KEYS } from '../constants/fines-acc-enf-action-add-api-data-keys.constant';
import { FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES } from '../constants/fines-acc-enf-action-add-field-types.constant';

export const FINES_ACC_ENF_ACTION_ADD_COURT_RESULT_PARAMETERS_MOCK = JSON.stringify([
  {
    name: 'courtcode',
    prompt: 'Court code',
    type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.menuAutocomplete,
    mandatory: true,
    apidata: FINES_ACC_ENF_ACTION_ADD_API_DATA_KEYS.courts,
  },
]);
