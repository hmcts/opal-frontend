import { ValidatorFn } from '@angular/forms';

interface IControlNames {
  fieldName: string;
  validators: ValidatorFn[];
  fieldsToRemove: string[];
}

export interface IFinesMacCreateAccountControlNames {
  fine: IControlNames;
  fixedPenalty: IControlNames;
  conditionalCaution: IControlNames;
}
