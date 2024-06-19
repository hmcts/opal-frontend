export interface IManualAccountCreationAccountDetailsState {
  formData: IManualAccountCreationAccountDetailsFields;
  snapshotFormData: IManualAccountCreationAccountDetailsFields;
  stateUnsavedChanges: boolean;
}

interface IManualAccountCreationAccountDetailsFields {
  businessUnit: string | null;
  defendantType: string | null;
}
