export interface IManualAccountCreationAccountDetailsState {
  formData: IManualAccountCreationAccountDetailsFields;
  snapshotFormData: IManualAccountCreationAccountDetailsFields;
}

interface IManualAccountCreationAccountDetailsFields {
  businessUnit: string | null;
  defendantType: string | null;
}
