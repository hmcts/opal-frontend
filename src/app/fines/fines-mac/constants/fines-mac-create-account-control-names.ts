import { Validators } from '@angular/forms';
import { IFinesMacCreateAccountControlNames } from '../interfaces';

export const FINES_MAC_CREATE_ACCOUNT_CONTROL_NAMES: IFinesMacCreateAccountControlNames = {
  fine: {
    fieldName: 'fineDefendantType',
    validators: [Validators.required],
    fieldsToRemove: ['fixedPenaltyDefendantType'],
  },
  fixedPenalty: {
    fieldName: 'fixedPenaltyDefendantType',
    validators: [Validators.required],
    fieldsToRemove: ['fineDefendantType'],
  },
  conditionalCaution: {
    fieldName: '',
    validators: [],
    fieldsToRemove: ['fineDefendantType', 'fixedPenaltyDefendantType'],
  },
};
