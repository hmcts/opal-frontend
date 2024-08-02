import { ValidatorFn } from '@angular/forms';

interface IControlNames {
  fieldName: string;
  validators: ValidatorFn[];
  fieldsToRemove: string[];
}

export interface IAccountTypeDefendantTypeControlNames {
  fine: IControlNames;
  fixedPenalty: IControlNames;
  conditionalCaution: IControlNames;
}
