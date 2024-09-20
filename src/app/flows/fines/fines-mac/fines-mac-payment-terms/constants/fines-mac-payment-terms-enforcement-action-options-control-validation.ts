import { IFinesMacPaymentTermsEnforcementActionsOptionsControlValidation } from '../interfaces/fines-mac-payment-terms-enforcment-actions-options-control-validation.interface';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_EARLIEST_RELEASE_DATE } from './controls/fines-mac-payment-terms-controls-earliest-release-date.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_REASON_ACCOUNT_IS_ON_NOENF } from './controls/fines-mac-payment-terms-controls-hold-enforcement-reason.constant';
import { FINES_MAC_PAYMENT_TERMS_CONTROLS_PRISON_AND_PRISON_NUMBER } from './controls/fines-mac-payment-terms-controls-prison-and-prison-number.constant';

export const FINES_MAC_PAYMENT_TERMS_ENFORCEMENT_ACTION_OPTIONS_CONTROL_VALIDATION: IFinesMacPaymentTermsEnforcementActionsOptionsControlValidation =
  {
    defendantIsInCustody: {
      fieldsToAdd: [
        FINES_MAC_PAYMENT_TERMS_CONTROLS_EARLIEST_RELEASE_DATE,
        FINES_MAC_PAYMENT_TERMS_CONTROLS_PRISON_AND_PRISON_NUMBER,
      ],
      fieldsToRemove: [FINES_MAC_PAYMENT_TERMS_CONTROLS_REASON_ACCOUNT_IS_ON_NOENF],
    },
    holdEnforcementOnAccount: {
      fieldsToAdd: [FINES_MAC_PAYMENT_TERMS_CONTROLS_REASON_ACCOUNT_IS_ON_NOENF],
      fieldsToRemove: [
        FINES_MAC_PAYMENT_TERMS_CONTROLS_EARLIEST_RELEASE_DATE,
        FINES_MAC_PAYMENT_TERMS_CONTROLS_PRISON_AND_PRISON_NUMBER,
      ],
    },
  };
