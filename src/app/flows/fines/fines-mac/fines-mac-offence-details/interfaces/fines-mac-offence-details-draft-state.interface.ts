import { IAbstractFormArrayControls } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import { IFinesMacOffenceDetailsForm } from './fines-mac-offence-details-form.interface';

interface IFinesMacOffenceDetailsDraftRemoval {
  rowIndex: number;
  formArray: Array<Record<string, unknown>>;
  formArrayControls: IAbstractFormArrayControls[];
}

export interface IFinesMacOffenceDetailsDraftState {
  offenceDetailsDraft: IFinesMacOffenceDetailsForm[];
  removeImposition: IFinesMacOffenceDetailsDraftRemoval | null;
  removeMinorCreditor: number | null;
}
