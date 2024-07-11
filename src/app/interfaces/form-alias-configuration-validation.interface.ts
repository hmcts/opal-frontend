import { ValidatorFn } from '@angular/forms';

export interface IFormAliasConfigurationValidation {
  controlName: string;
  validators: ValidatorFn[];
}
