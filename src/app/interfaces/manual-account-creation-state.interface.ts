import {
  IManualAccountCreationAccountDetailsState,
  IManualAccountCreationContactDetailsState,
  IManualAccountCreationEmployerDetailsState,
} from '@interfaces';

export interface IManualAccountCreationState {
  employerDetails: IManualAccountCreationEmployerDetailsState;
  accountDetails: IManualAccountCreationAccountDetailsState;
  contactDetails: IManualAccountCreationContactDetailsState;
  unsavedChanges: boolean;
  stateChanges: boolean;
}
