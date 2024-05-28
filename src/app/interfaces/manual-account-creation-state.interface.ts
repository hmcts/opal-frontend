import { IManualAccountCreationPersonalDetailsState } from './manual-account-creation-personal-details-state.interface';

export interface IManualAccountCreationState {
  personalDetails: IManualAccountCreationPersonalDetailsState;
  unsavedChanges: boolean;
  stateChanges: boolean;
}
