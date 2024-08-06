import {
  IAccountCommentsNotesState,
  IBusinessUnit,
  IManualAccountCreationAccountDetailsState,
  IManualAccountCreationCompanyDetailsState,
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
  companyDetails: IManualAccountCreationCompanyDetailsState;
  courtDetails: IManualAccountCreationCourtDetailsState;
  accountCommentsNotes: IAccountCommentsNotesState;
  businessUnit: IBusinessUnit;
  unsavedChanges: boolean;
  stateChanges: boolean;
}
