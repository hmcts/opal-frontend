import { IFinesAccEnfOverrideAddChangeFieldErrors } from '../interfaces/fines-acc-enf-override-add-change-field-errors.interface';

export const FINES_ACC_ENF_OVERRIDE_ADD_CHANGE_FIELD_ERRORS: IFinesAccEnfOverrideAddChangeFieldErrors = {
  fenf_account_enforcement_action: {
    required: {
      message: `Select an enforcement action`,
      priority: 1,
    },
  },
  fenf_account_enforcement_enforcer: {
    required: {
      message: `Select an enforcer`,
      priority: 2,
    },
  },
  fenf_account_enforcement_lja: {
    required: {
      message: `Select a Local Justice Area`,
      priority: 2,
    },
  },
};
