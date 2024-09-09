import { ValidatorFn } from '@angular/forms';

export interface IFinesMacFormControl {
  fieldName: string;
  validators: ValidatorFn[];
}
