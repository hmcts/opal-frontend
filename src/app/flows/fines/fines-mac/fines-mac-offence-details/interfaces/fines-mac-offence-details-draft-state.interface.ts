import { FormArray } from '@angular/forms';
import { IAbstractFormArrayControls } from '@components/abstract/interfaces/abstract-form-array-controls.interface';
import { IFinesMacOffenceDetailsForm } from './fines-mac-offence-details-form.interface';

export interface IFinesMacOffenceDetailsDraftState {
  offenceDetailsDraft: IFinesMacOffenceDetailsForm[];
  removeImposition: {
    rowIndex: number;
    formArray: FormArray;
    formArrayControls: IAbstractFormArrayControls[];
  } | null;
}
