import { Validators } from '@angular/forms';
import { IAccountTypeDefendantTypeControlNames } from '@interfaces';

export const MANUAL_ACCOUNT_CREATION_ACCOUNT_TYPE_DEFENDANT_TYPE_CONTROL_NAMES: IAccountTypeDefendantTypeControlNames =
  {
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
