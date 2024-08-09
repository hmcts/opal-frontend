import { ValidatorFn } from '@angular/forms';

export interface IAbstractFormArrayControlValidation {
  controlName: string;
  validators: ValidatorFn[];
}
