export interface IManualAccountCreationAccountDetailsState {
  formData: {
    businessUnit: string | null;
    defendantType: string | null;
  };
  snapshotFormData: {
    businessUnit: string | null;
    defendantType: string | null;
  };
  stateUnsavedChanges: boolean;
}
