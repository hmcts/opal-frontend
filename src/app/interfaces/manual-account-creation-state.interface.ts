import {
  IManualAccountCreationAccountDetailsState,
  IManualAccountCreationCompanyDetailsState,
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
  companyDetails: IManualAccountCreationCompanyDetailsState;
  unsavedChanges: boolean;
  stateChanges: boolean;
}
