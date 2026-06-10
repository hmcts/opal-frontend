import { FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES } from '../constants/fines-acc-enf-action-add-field-types.constant';
import { IFinesAccEnfActionAddFormField } from '../interfaces/fines-acc-enf-action-add-form-field.interface';

export const FINES_ACC_ENF_ACTION_ADD_COLLECTION_TYPE_FORM_FIELD_MOCK = {
  controlName: 'fines-acc-enf-action-add_collection_type',
  parameterName: 'collection_type',
  label: 'Collection type',
  type: FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES.menuRadio,
  required: true,
  options: [
    { value: 'standard', name: 'Standard' },
    { value: 'fast track', name: 'Fast track' },
  ],
} as IFinesAccEnfActionAddFormField;
