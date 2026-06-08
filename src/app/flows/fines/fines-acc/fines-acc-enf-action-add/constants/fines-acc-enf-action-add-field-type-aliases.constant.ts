import { FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES } from './fines-acc-enf-action-add-field-types.constant';

export const FINES_ACC_ENF_ACTION_ADD_FIELD_TYPE_ALIASES = {
  decimal: [FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.decimal, 'decimal-2dp'],
  textarea: ['text-1000', FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.textarea],
  text: [FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.text, 'text-5', 'text-60', 'text-100'],
  menuRadio: [
    'menu',
    FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.menuRadio,
    'collection type',
    'collection_type',
    'collection-type',
    'collectiontype',
  ],
  menuAutocomplete: [FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.menuAutocomplete, 'enforcers'],
  menuCheckbox: [FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.menuCheckbox],
  date: [FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.date],
  integer: [FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.integer],
} as const;
