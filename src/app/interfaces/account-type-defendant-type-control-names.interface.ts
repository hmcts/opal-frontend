import { ValidatorFn } from '@angular/forms';

export interface IAccountTypeDefendantTypeControlNames {
  [key: string]: { fieldName: string; validators: ValidatorFn[]; fieldsToRemove: string[] };
}
