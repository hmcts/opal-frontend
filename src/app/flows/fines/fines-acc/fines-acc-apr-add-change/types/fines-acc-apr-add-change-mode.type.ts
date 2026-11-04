import { FINES_ACC_APR_ADD_CHANGE_MODES } from '../constants/fines-acc-apr-add-change-modes.constant';

export type TFinesAccAprAddChangeMode =
  (typeof FINES_ACC_APR_ADD_CHANGE_MODES)[keyof typeof FINES_ACC_APR_ADD_CHANGE_MODES];
