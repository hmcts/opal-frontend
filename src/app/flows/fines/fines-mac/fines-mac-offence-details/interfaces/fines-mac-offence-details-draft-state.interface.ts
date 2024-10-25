import { FormArray } from '@angular/forms';
import { IAbstractFormArrayControls } from '@components/abstract/interfaces/abstract-form-array-controls.interface';
import { IFinesMacOffenceDetailsForm } from './fines-mac-offence-details-form.interface';

interface IFinesMacOffenceDetailsDraftRemoval {
  rowIndex: number;
  formArray: FormArray;
  formArrayControls: IAbstractFormArrayControls[];
}

export interface IFinesMacOffenceDetailsDraftState {
  offenceDetailsDraft: IFinesMacOffenceDetailsForm[];
  removeImposition: IFinesMacOffenceDetailsDraftRemoval | null;
  removeMinorCreditor: number | null;
}
