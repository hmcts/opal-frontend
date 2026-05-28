import { FINES_ACC_ENF_ACTION_ADD_API_DATA_KEYS } from '../constants/fines-acc-enf-action-add-api-data-keys.constant';
import { FINES_ACC_ENF_ACTION_ADD_FIELD_TYPE_ALIASES } from '../constants/fines-acc-enf-action-add-field-type-aliases.constant';
import { FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES } from '../constants/fines-acc-enf-action-add-field-types.constant';

export const FINES_ACC_ENF_ACTION_ADD_SUPPORTED_FIELD_TYPES_RESULT_PARAMETERS_MOCK = JSON.stringify([
  {
    name: 'basisofcommittal',
    prompt: 'Basis of committal',
    type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPE_ALIASES.textarea[0],
    mandatory: false,
    min: 0,
    max: 1000,
    language_dependent: true,
  },
  {
    name: 'enforcer',
    prompt: 'Enforcer',
    type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.menuAutocomplete,
    apidata: FINES_ACC_ENF_ACTION_ADD_API_DATA_KEYS.enforcers,
    mandatory: true,
    min: 1,
    max: 1,
    language_dependent: true,
  },
  {
    name: 'selecthowitwillbeserved',
    prompt: 'Select how it will be served',
    type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.menuCheckbox,
    mandatory: false,
    min: 0,
    max: 2,
    options: ['Consecutive', 'Concurrent'],
    language_dependent: true,
  },
  {
    name: 'normaldeductionrate',
    prompt: 'Normal deduction rate',
    type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPE_ALIASES.decimal[1],
    mandatory: true,
    min: -9999999999.99,
    max: 9999999999.99,
    language_dependent: false,
  },
]);
