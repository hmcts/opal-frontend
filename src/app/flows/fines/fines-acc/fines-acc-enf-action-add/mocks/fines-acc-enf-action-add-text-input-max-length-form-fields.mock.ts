import { FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES } from '../constants/fines-acc-enf-action-add-field-types.constant';
import { IFinesAccEnfActionAddFormField } from '../interfaces/fines-acc-enf-action-add-form-field.interface';

export const FINES_ACC_ENF_ACTION_ADD_TEXT_INPUT_MAX_LENGTH_FORM_FIELDS_MOCK: IFinesAccEnfActionAddFormField[] = [
  {
    controlName: 'fines-acc-enf-action-add_short_code',
    parameterName: 'short_code',
    label: 'Short code',
    type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.text,
    required: false,
    min: 1,
    max: 5,
    options: [],
  },
  {
    controlName: 'fines-acc-enf-action-add_reason',
    parameterName: 'reason',
    label: 'Reason',
    type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.text,
    required: true,
    min: 1,
    max: 60,
    options: [],
  },
  {
    controlName: 'fines-acc-enf-action-add_long_text',
    parameterName: 'long_text',
    label: 'Long text',
    type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.text,
    required: false,
    min: 1,
    max: 100,
    options: [],
  },
  {
    controlName: 'fines-acc-enf-action-add_notes',
    parameterName: 'notes',
    label: 'Notes',
    type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.text,
    required: false,
    min: 0,
    max: 1000,
    options: [],
  },
];
