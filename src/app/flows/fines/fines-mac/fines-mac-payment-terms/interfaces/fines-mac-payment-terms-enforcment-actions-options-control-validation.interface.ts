import { IAbstractFormArrayControlValidation } from '@hmcts/opal-frontend-common/components/abstract';

interface IFinesMacPaymentTermsEnforcementActionsOptionsFieldsAddRemove {
  fieldsToAdd: IAbstractFormArrayControlValidation[];
  fieldsToRemove: IAbstractFormArrayControlValidation[];
}

export interface IFinesMacPaymentTermsEnforcementActionsOptionsControlValidation {
  PRIS: IFinesMacPaymentTermsEnforcementActionsOptionsFieldsAddRemove;
  NOENF: IFinesMacPaymentTermsEnforcementActionsOptionsFieldsAddRemove;
}
