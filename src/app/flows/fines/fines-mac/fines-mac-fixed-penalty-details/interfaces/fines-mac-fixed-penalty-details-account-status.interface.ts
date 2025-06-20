export interface IFinesMacFixedPenaltyDetailsAccountStatus {
  employerDetails: boolean;
  accountDetails: boolean;
  contactDetails: boolean;
  parentGuardianDetails: boolean;
  personalDetails: boolean;
  companyDetails: boolean;
  courtDetails: boolean;
  offenceDetails?: boolean;
  paymentTerms?: boolean;
  accountCommentsNotes: boolean;
  unsavedChanges: boolean;
  stateChanges: boolean;
}
