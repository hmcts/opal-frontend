import { Validators } from '@angular/forms';
import { IFinesMacCreateAccountControlNames } from '../interfaces';

export const FINES_MAC_CREATE_ACCOUNT_CONTROL_NAMES: IFinesMacCreateAccountControlNames = {
  fine: {
    fieldName: 'FineDefendantType',
    validators: [Validators.required],
    fieldsToRemove: ['FixedPenaltyDefendantType'],
  },
  fixedPenalty: {
    fieldName: 'FixedPenaltyDefendantType',
    validators: [Validators.required],
    fieldsToRemove: ['FineDefendantType'],
  },
  conditionalCaution: {
    fieldName: '',
    validators: [],
    fieldsToRemove: ['FineDefendantType', 'FixedPenaltyDefendantType'],
  },
};