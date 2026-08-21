import { FormControl } from '@angular/forms';
import { IOpalFinesBusinessUnit } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit.interface';

export interface IFinesReportsSelectBusinessUnitRow {
  businessUnit: IOpalFinesBusinessUnit;
  control: FormControl<boolean>;
  inputId: string;
  inputName: string;
}
