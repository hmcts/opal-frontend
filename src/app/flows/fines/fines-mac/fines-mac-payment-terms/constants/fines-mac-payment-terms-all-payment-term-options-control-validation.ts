import { IFinesMacPaymentTermsAllPaymentTermOptionsControlValidation } from '../interfaces/fines-mac-payment-terms-all-payment-term-options-control-validation.interface';
import { FINES_MAC_PAYMENT_TERMS_INSTALMENTS_ONLY_CONTROL_VALIDATION } from './fines-mac-payment-terms-instalments-only-control-validation';
import { FINES_MAC_PAYMENT_TERMS_LUMP_SUM_CONTROL_VALIDATION } from './fines-mac-payment-terms-lump-sum-control-validation';
import { FINES_MAC_PAYMENT_TERMS_PAY_IN_FULL_CONTROL_VALIDATION } from './fines-mac-payment-terms-pay-in-full-control-validation';

export const FINES_MAC_PAYMENT_TERMS_ALL_PAYMENT_TERM_OPTIONS_CONTROL_VALIDATION: IFinesMacPaymentTermsAllPaymentTermOptionsControlValidation =
  {
    payInFull: {
      fieldsToAdd: FINES_MAC_PAYMENT_TERMS_PAY_IN_FULL_CONTROL_VALIDATION,
      fieldsToRemove: [
        ...FINES_MAC_PAYMENT_TERMS_INSTALMENTS_ONLY_CONTROL_VALIDATION,
        ...FINES_MAC_PAYMENT_TERMS_LUMP_SUM_CONTROL_VALIDATION,
      ],
    },
    instalmentsOnly: {
      fieldsToAdd: FINES_MAC_PAYMENT_TERMS_INSTALMENTS_ONLY_CONTROL_VALIDATION,
      fieldsToRemove: [
        ...FINES_MAC_PAYMENT_TERMS_PAY_IN_FULL_CONTROL_VALIDATION,
        ...FINES_MAC_PAYMENT_TERMS_LUMP_SUM_CONTROL_VALIDATION,
      ],
    },
    lumpSumPlusInstalments: {
      fieldsToAdd: FINES_MAC_PAYMENT_TERMS_LUMP_SUM_CONTROL_VALIDATION,
      fieldsToRemove: [
        ...FINES_MAC_PAYMENT_TERMS_PAY_IN_FULL_CONTROL_VALIDATION,
        ...FINES_MAC_PAYMENT_TERMS_INSTALMENTS_ONLY_CONTROL_VALIDATION,
      ],
    },
  };
