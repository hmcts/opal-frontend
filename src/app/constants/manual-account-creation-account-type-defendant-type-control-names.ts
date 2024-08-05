import { Validators } from '@angular/forms';
import { IAccountTypeDefendantTypeControlNames } from '@interfaces';

export const MANUAL_ACCOUNT_CREATION_ACCOUNT_TYPE_DEFENDANT_TYPE_CONTROL_NAMES: IAccountTypeDefendantTypeControlNames =
  {
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
