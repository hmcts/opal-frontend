import { IFinesMacAccountTypeDefendantTypes } from '@interfaces/fines/mac';
import { FINES_MAC_DEFENDANT_TYPES } from '@constants/fines/mac';

export const FINES_MAC_ACCOUNT_TYPE_DEFENDANT_TYPES: IFinesMacAccountTypeDefendantTypes = {
  fine: {
    adultOrYouthOnly: FINES_MAC_DEFENDANT_TYPES['adultOrYouthOnly'],
    parentOrGuardianToPay: FINES_MAC_DEFENDANT_TYPES['parentOrGuardianToPay'],
    company: FINES_MAC_DEFENDANT_TYPES['company'],
  },
  fixedPenalty: {
    adultOrYouthOnly: FINES_MAC_DEFENDANT_TYPES['adultOrYouthOnly'],
    company: FINES_MAC_DEFENDANT_TYPES['company'],
  },

  conditionalCaution: {
    adultOrYouthOnly: FINES_MAC_DEFENDANT_TYPES['adultOrYouthOnly'],
  },
};
