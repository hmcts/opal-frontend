import { FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES } from '../constants/fines-acc-enf-action-add-field-types.constant';

export type TFinesAccEnfActionAddFieldType =
  (typeof FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES)[keyof typeof FINES_ACC_ENF_ACTION_ADD_FIELD_TYPES];
