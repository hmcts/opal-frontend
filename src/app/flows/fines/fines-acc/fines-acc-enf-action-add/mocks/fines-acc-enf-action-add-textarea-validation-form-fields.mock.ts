import { FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES } from '../constants/fines-acc-enf-action-add-field-types.constant';
import { IFinesAccEnfActionAddFormField } from '../interfaces/fines-acc-enf-action-add-form-field.interface';

export const FINES_ACC_ENF_ACTION_ADD_TEXTAREA_VALIDATION_FORM_FIELDS_MOCK: IFinesAccEnfActionAddFormField[] = [
  {
    controlName: 'fines-acc-enf-action-add_notes',
    parameterName: 'notes',
    label: 'Notes',
    type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.textarea,
    required: false,
    min: 5,
    max: 1000,
    options: [],
  },
  {
    controlName: 'fines-acc-enf-action-add_long_text',
    parameterName: 'long_text',
    label: 'Long text',
    type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.text,
    required: false,
    max: 61,
    options: [],
  },
];
