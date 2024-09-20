import { IFinesMacCreateAccountFieldErrors } from '../interfaces/fines-mac-create-account-field-errors.interface';
import { FINES_MAC_CREATE_ACCOUNT_CONTROLS_BUSINESS_UNIT as F_M_CREATE_ACCOUNT_BUSINESS_UNIT } from '../constants/controls/fines-mac-create-account-controls-business-unit';
import { FINES_MAC_CREATE_ACCOUNT_CONTROLS_ACCOUNT_TYPE as F_M_CREATE_ACCOUNT_ACCOUNT_TYPE } from '../constants/controls/fines-mac-create-account-controls-account-type';
import { FINES_MAC_CREATE_ACCOUNT_CONTROLS_DEFENDANT_TYPE as F_M_CREATE_ACCOUNT_DEFENDANT_TYPE } from '../constants/controls/fines-mac-create-account-controls-defendant-type';
import { IAbstractFormBaseFieldErrors } from '@components/abstract/abstract-form-base/interfaces/abstract-form-base-field-errors.interface';

export const FINES_MAC_CREATE_ACCOUNT_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  [F_M_CREATE_ACCOUNT_ACCOUNT_TYPE.controlName]: {
    required: {
      message: 'Select an account type',
      priority: 1,
    },
  },
  [F_M_CREATE_ACCOUNT_DEFENDANT_TYPE.controlName]: {
    required: {
      message: 'Select a defendant type',
      priority: 1,
    },
  },
  fixed_penalty_defendant_type: {
    required: {
      message: 'Select a defendant type',
      priority: 1,
    },
  },
  [F_M_CREATE_ACCOUNT_BUSINESS_UNIT.controlName]: {
    required: {
      message: 'Enter a business unit',
      priority: 1,
    },
  },
};
