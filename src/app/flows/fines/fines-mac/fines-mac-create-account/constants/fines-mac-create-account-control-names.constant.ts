import { Validators } from '@angular/forms';
import { IFinesMacCreateAccountControlNames } from '../validators/fines-mac-create-account-control-names.validators';

export const FINES_MAC_CREATE_ACCOUNT_CONTROL_NAMES: IFinesMacCreateAccountControlNames = {
  Fine: {
    fieldName: 'fm_create_account_fine_defendant_type',
    validators: [Validators.required],
  },
  'Fixed Penalty': {
    fieldName: 'fm_create_account_fixed_penalty_defendant_type',
    validators: [Validators.required],
  },
  'Conditional Caution': {
    fieldName: '',
    validators: [],
  },
};
