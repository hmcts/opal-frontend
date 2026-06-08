import { FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES } from '../constants/fines-acc-enf-action-add-field-types.constant';
import { IFinesAccEnfActionAddFormField } from '../interfaces/fines-acc-enf-action-add-form-field.interface';

export const FINES_ACC_ENF_ACTION_ADD_FORM_FIELDS_MOCK: IFinesAccEnfActionAddFormField[] = [
  {
    controlName: 'fines-acc-enf-action-add_reason',
    parameterName: 'reason',
    label: 'Reason',
    type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.text,
    required: true,
    max: 24,
    options: [],
    welshControlName: 'fines-acc-enf-action-add_reason_cy',
    welshLabel: 'Reason - Welsh version',
  },
  {
    controlName: 'fines-acc-enf-action-add_hearing_date',
    parameterName: 'hearing_date',
    label: 'Hearing date',
    type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.date,
    required: false,
    options: [],
  },
  {
    controlName: 'fines-acc-enf-action-add_amount',
    parameterName: 'amount',
    label: 'Amount',
    type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.decimal,
    required: false,
    options: [],
  },
];
