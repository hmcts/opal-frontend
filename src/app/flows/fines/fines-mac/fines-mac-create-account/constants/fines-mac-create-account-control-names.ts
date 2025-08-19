import { Validators } from '@angular/forms';
import { IFinesMacCreateAccountControlNames } from '../interfaces/fines-mac-create-account-control-names.interface';

export const FINES_MAC_CREATE_ACCOUNT_CONTROL_NAMES: IFinesMacCreateAccountControlNames = {
  Fine: {
    fieldName: 'fm_create_account_fine_defendant_type',
    validators: [Validators.required],
    fieldsToRemove: ['fm_create_account_fixed_penalty_defendant_type'],
  },
  'Fixed Penalty': {
    fieldName: 'fm_create_account_fixed_penalty_defendant_type',
    validators: [Validators.required],
    fieldsToRemove: ['fm_create_account_fine_defendant_type'],
  },
  'Conditional Caution': {
    fieldName: '',
    validators: [],
    fieldsToRemove: ['fm_create_account_fine_defendant_type', 'fm_create_account_fixed_penalty_defendant_type'],
  },
};
