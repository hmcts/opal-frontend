import {
  IManualAccountCreationAccountDetailsState,
  IManualAccountCreationContactDetailsState,
  IManualAccountCreationEmployerDetailsState,
  IManualAccountCreationParentGuardianDetailsState,
} from '@interfaces';
import { IManualAccountCreationEmployerDetailsState } from './manual-account-creation-employer-details-state.interface';
import { IManualAccountCreationPersonalDetailsState } from './manual-account-creation-personal-details-state.interface';

export interface IManualAccountCreationState {
  employerDetails: IManualAccountCreationEmployerDetailsState;
  accountDetails: IManualAccountCreationAccountDetailsState;
  contactDetails: IManualAccountCreationContactDetailsState;
  parentGuardianDetails: IManualAccountCreationParentGuardianDetailsState;
  personalDetails: IManualAccountCreationPersonalDetailsState;
  unsavedChanges: boolean;
  stateChanges: boolean;
}
