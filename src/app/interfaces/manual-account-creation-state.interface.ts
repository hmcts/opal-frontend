import {
  IBusinessUnit,
  IManualAccountCreationAccountDetailsState,
  IManualAccountCreationCompanyDetailsState,
  IManualAccountCreationContactDetailsState,
  IManualAccountCreationCourtDetailsState,
  IManualAccountCreationEmployerDetailsState,
  IManualAccountCreationLanguagePreferencesState,
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
  courtDetails: IManualAccountCreationCourtDetailsState;
  languagePreferences: IManualAccountCreationLanguagePreferencesState;
  businessUnit: IBusinessUnit;
  unsavedChanges: boolean;
  stateChanges: boolean;
}
