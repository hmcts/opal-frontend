import { IManualAccountCreationEmployerDetailsState } from './manual-account-creation-employer-details-state.interface';
import { IManualAccountCreationPersonalDetailsState } from './manual-account-creation-personal-details-state.interface';

export interface IManualAccountCreationState {
  employerDetails: IManualAccountCreationEmployerDetailsState;
  personalDetails: IManualAccountCreationPersonalDetailsState;
  unsavedChanges: boolean;
  stateChanges: boolean;
}
