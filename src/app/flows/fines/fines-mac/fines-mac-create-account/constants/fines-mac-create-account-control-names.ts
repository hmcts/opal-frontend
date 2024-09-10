import { Validators } from '@angular/forms';
import { IFinesMacCreateAccountControlNames } from '../interfaces/fines-mac-create-account-control-names.interface';

export const FINES_MAC_CREATE_ACCOUNT_CONTROL_NAMES: IFinesMacCreateAccountControlNames = {
  fine: {
    fieldName: 'fine_defendant_type',
    validators: [Validators.required],
    fieldsToRemove: ['fixed_penalty_defendant_type'],
  },
  fixedPenalty: {
    fieldName: 'fixed_penalty_defendant_type',
    validators: [Validators.required],
    fieldsToRemove: ['fine_defendant_type'],
  },
  conditionalCaution: {
    fieldName: '',
    validators: [],
    fieldsToRemove: ['fine_defendant_type', 'fixed_penalty_defendant_type'],
  },
};
