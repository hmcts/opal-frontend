import { type ValidatorFn } from '@angular/forms';

export interface IFinesVehicleRegistrationConfig {
  errorMessage: string;
  validator: ValidatorFn;
}
