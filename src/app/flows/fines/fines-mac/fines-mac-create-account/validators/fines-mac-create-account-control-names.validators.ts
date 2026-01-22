import { ValidatorFn } from '@angular/forms';

interface IControlNames {
  fieldName: string;
  validators: ValidatorFn[];
}

export interface IFinesMacCreateAccountControlNames {
  Fine: IControlNames;
  'Fixed Penalty': IControlNames;
  'Conditional Caution': IControlNames;
}
