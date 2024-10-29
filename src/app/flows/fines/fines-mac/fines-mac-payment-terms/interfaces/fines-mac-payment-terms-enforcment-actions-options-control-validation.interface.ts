import { IAbstractFormArrayControlValidation } from '@components/abstract/interfaces/abstract-form-array-control-validation.interface';

interface IFinesMacPaymentTermsEnforcementActionsOptionsFieldsAddRemove {
  fieldsToAdd: IAbstractFormArrayControlValidation[];
  fieldsToRemove: IAbstractFormArrayControlValidation[];
}

export interface IFinesMacPaymentTermsEnforcementActionsOptionsControlValidation {
  PRIS: IFinesMacPaymentTermsEnforcementActionsOptionsFieldsAddRemove;
  NOENF: IFinesMacPaymentTermsEnforcementActionsOptionsFieldsAddRemove;
}
