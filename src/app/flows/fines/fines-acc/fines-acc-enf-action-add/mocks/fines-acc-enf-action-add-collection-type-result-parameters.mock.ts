import { FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES } from '../constants/fines-acc-enf-action-add-field-types.constant';

export const FINES_ACC_ENF_ACTION_ADD_COLLECTION_TYPE_RESULT_PARAMETERS_MOCK = JSON.stringify([
  {
    name: 'collection_type',
    prompt: 'Collection type',
    type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.menuRadio,
    mandatory: true,
    min: 1,
    max: 1,
    options: [
      { value: 'standard', name: 'Standard' },
      { value: 'fast_track', name: 'Fast track' },
    ],
    languageDependent: false,
  },
]);
