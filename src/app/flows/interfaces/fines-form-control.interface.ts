import { ValidatorFn } from '@angular/forms';

export interface IFlowFormControl {
  fieldName: string;
  validators: ValidatorFn[];
}
