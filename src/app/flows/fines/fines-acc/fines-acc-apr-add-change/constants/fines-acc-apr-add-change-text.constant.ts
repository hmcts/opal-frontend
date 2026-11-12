import { FINES_ACC_APR_ADD_CHANGE_MODES } from './fines-acc-apr-add-change-modes.constant';
import { FINES_ACC_APR_ROUTING_TITLES } from '../../fines-acc-apr-manage/constants/fines-acc-apr-routing-titles.constant';

export const FINES_ACC_APR_ADD_CHANGE_TEXT = {
  [FINES_ACC_APR_ADD_CHANGE_MODES.ADD]: {
    headingText: FINES_ACC_APR_ROUTING_TITLES.children.add,
    labelText: 'Enter payment reference',
    successMessage: 'Alternate payment reference added',
  },
  [FINES_ACC_APR_ADD_CHANGE_MODES.CHANGE]: {
    headingText: FINES_ACC_APR_ROUTING_TITLES.children.change,
    labelText: 'Change alternate payment reference',
    successMessage: 'Alternate payment reference updated',
  },
} as const;
