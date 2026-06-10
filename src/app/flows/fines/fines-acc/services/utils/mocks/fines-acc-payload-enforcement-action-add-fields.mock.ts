import { FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES } from '../../../fines-acc-enf-action-add/constants/fines-acc-enf-action-add-field-types.constant';
import { IFinesAccEnfActionAddFormField } from '../../../fines-acc-enf-action-add/interfaces/fines-acc-enf-action-add-form-field.interface';

export const FINES_ACC_PAYLOAD_ENFORCEMENT_ACTION_ADD_FIELDS_MOCK: IFinesAccEnfActionAddFormField[] = [
  {
    controlName: 'fines-acc-enf-action-add_reason',
    parameterName: 'reason',
    label: 'Reason',
    type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.text,
    required: true,
    options: [],
    welshControlName: 'fines-acc-enf-action-add_reason_cy',
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
    controlName: 'fines-acc-enf-action-add_empty_note',
    parameterName: 'empty_note',
    label: 'Empty note',
    type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.text,
    required: false,
    options: [],
  },
];
