import { ValidatorFn } from '@angular/forms';

export interface IFormArrayControlValidation {
  controlName: string;
  validators: ValidatorFn[];
}
