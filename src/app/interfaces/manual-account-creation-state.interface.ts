import { IManualAccountCreationEmployerDetailsState } from './manual-account-creation-employer-details-state.interface';

export interface IManualAccountCreationState {
  employerDetails: IManualAccountCreationEmployerDetailsState;
  unsavedChanges: boolean;
  stateChanges: boolean;
}
