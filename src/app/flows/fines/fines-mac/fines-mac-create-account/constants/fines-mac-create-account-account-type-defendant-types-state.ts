import { IFinesMacCreateAccountAccountTypeDefendantTypes } from '../interfaces/fines-mac-create-account-account-type-defendant-types.interface';
import { FINES_MAC_CREATE_ACCOUNT_DEFENDANT_TYPES } from '../constants/fines-mac-create-account-defendant-types';

export const FINES_MAC_CREATE_ACCOUNT_ACCOUNT_TYPE_DEFENDANT_TYPES_STATE: IFinesMacCreateAccountAccountTypeDefendantTypes =
  {
    fine: {
      adultOrYouthOnly: FINES_MAC_CREATE_ACCOUNT_DEFENDANT_TYPES['adultOrYouthOnly'],
      parentOrGuardianToPay: FINES_MAC_CREATE_ACCOUNT_DEFENDANT_TYPES['parentOrGuardianToPay'],
      company: FINES_MAC_CREATE_ACCOUNT_DEFENDANT_TYPES['company'],
    },
    fixedPenalty: {
      adultOrYouthOnly: FINES_MAC_CREATE_ACCOUNT_DEFENDANT_TYPES['adultOrYouthOnly'],
      company: FINES_MAC_CREATE_ACCOUNT_DEFENDANT_TYPES['company'],
    },

    conditionalCaution: {
      adultOrYouthOnly: FINES_MAC_CREATE_ACCOUNT_DEFENDANT_TYPES['adultOrYouthOnly'],
    },
  };
