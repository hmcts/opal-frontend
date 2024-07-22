import {
  IManualAccountCreationAccountDetailsState,
  IManualAccountCreationContactDetailsState,
  IManualAccountCreationEmployerDetailsState,
  IManualAccountCreationParentGuardianDetailsState,
  IManualAccountCreationPersonalDetailsState,
} from '@interfaces';

export interface IManualAccountCreationState {
  employerDetails: IManualAccountCreationEmployerDetailsState;
  accountDetails: IManualAccountCreationAccountDetailsState;
  contactDetails: IManualAccountCreationContactDetailsState;
  parentGuardianDetails: IManualAccountCreationParentGuardianDetailsState;
  personalDetails: IManualAccountCreationPersonalDetailsState;
  unsavedChanges: boolean;
  stateChanges: boolean;
}
