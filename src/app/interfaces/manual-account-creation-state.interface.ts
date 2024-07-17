import {
  IBusinessUnit,
  IManualAccountCreationAccountDetailsState,
  IManualAccountCreationContactDetailsState,
  IManualAccountCreationCourtDetailsState,
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
  courtDetails: IManualAccountCreationCourtDetailsState;
  businessUnit: IBusinessUnit;
  unsavedChanges: boolean;
  stateChanges: boolean;
}
