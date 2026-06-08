import { FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES } from '../constants/fines-acc-enf-action-add-field-types.constant';
import { IFinesAccEnfActionAddFormField } from '../interfaces/fines-acc-enf-action-add-form-field.interface';

export const FINES_ACC_ENF_ACTION_ADD_MAPPED_FIELDS_MOCK: IFinesAccEnfActionAddFormField[] = [
  {
    controlName: 'fines-acc-enf-action-add_reason',
    parameterName: 'reason',
    label: 'Reason',
    type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.text,
    required: true,
    options: [],
    welshControlName: 'fines-acc-enf-action-add_reason_cy',
    welshLabel: 'Reason - Welsh version',
  },
];
