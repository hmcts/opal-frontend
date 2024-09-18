import { IFinesMacPaymentTermsPaymentTermOptionsControlValidation } from './fines-mac-payment-terms-payment-term-options-control-validation.interface';

interface IFinesMacPaymentTermsPaymentTermFieldsAddRemove {
  fieldsToAdd: IFinesMacPaymentTermsPaymentTermOptionsControlValidation[];
  fieldsToRemove: IFinesMacPaymentTermsPaymentTermOptionsControlValidation[];
}

export interface IFinesMacPaymentTermsAllPaymentTermOptionsControlValidation {
  payInFull: IFinesMacPaymentTermsPaymentTermFieldsAddRemove;
  instalmentsOnly: IFinesMacPaymentTermsPaymentTermFieldsAddRemove;
  lumpSumPlusInstalments: IFinesMacPaymentTermsPaymentTermFieldsAddRemove;
}
