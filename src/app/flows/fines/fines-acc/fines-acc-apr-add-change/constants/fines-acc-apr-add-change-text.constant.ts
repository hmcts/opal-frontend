import { FINES_ACC_APR_ADD_CHANGE_MODES } from './fines-acc-apr-add-change-modes.constant';

export const FINES_ACC_APR_ADD_CHANGE_TEXT = {
  [FINES_ACC_APR_ADD_CHANGE_MODES.ADD]: {
    headingText: 'Add Alternate Payment Reference',
    labelText: 'Enter payment reference',
    successMessage: 'Alternate payment reference added',
  },
  [FINES_ACC_APR_ADD_CHANGE_MODES.CHANGE]: {
    headingText: 'Change Alternate Payment Reference',
    labelText: 'Change alternate payment reference',
    successMessage: 'Alternate payment reference updated',
  },
} as const;
