import { FINES_ACC_ENF_ACTION_DENIED_TYPES } from '../constants/fines-acc-enf-action-denied-types.constant';

export type TFinesAccEnfActionDeniedType =
  (typeof FINES_ACC_ENF_ACTION_DENIED_TYPES)[keyof typeof FINES_ACC_ENF_ACTION_DENIED_TYPES];
