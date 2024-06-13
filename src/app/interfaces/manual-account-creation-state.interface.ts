import { IManualAccountCreationAccountDetailsState, IManualAccountCreationEmployerDetailsState } from '@interfaces';

export interface IManualAccountCreationState {
  employerDetails: IManualAccountCreationEmployerDetailsState;
  accountDetails: IManualAccountCreationAccountDetailsState;
  unsavedChanges: boolean;
  stateChanges: boolean;
}
