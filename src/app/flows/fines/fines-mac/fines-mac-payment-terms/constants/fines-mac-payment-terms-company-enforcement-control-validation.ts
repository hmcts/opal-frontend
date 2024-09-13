import { IFinesMacPaymentTermsCompanyEnforcementControlValidation } from '../interfaces/fines-mac-payment-terms-company-enforcement-control-validation.interface';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_HOLD_ENFORCEMENT_ON_ACCOUNT as PT_CONTROLS_HOLD_ENFORCEMENT_ON_ACCOUNT } from './controls/fines-mac-payment-terms-controls-hold-enforcement-on-account.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_REASON_ACCOUNT_IS_ON_NOENF as PT_CONTROLS_REASON_ACCOUNT_IS_ON_NOENF } from './controls/fines-mac-payment-terms-controls-hold-enforcement-reason.constant';

export const FINES_MAC_PAYMENT_TERMS_COMPANY_ENFORCEMENT_CONTROL_VALIDATION: IFinesMacPaymentTermsCompanyEnforcementControlValidation[] =
  [PT_CONTROLS_HOLD_ENFORCEMENT_ON_ACCOUNT, PT_CONTROLS_REASON_ACCOUNT_IS_ON_NOENF];
