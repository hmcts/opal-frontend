import { IFinesMacAccountTypeDefendantTypes } from '@interfaces/fines/mac';
import { FINES_MAC__DEFENDANT_TYPES_STATE } from '@constants/fines/mac';

export const FINES_MAC__ACCOUNT_TYPE_DEFENDANT_TYPES_STATE: IFinesMacAccountTypeDefendantTypes = {
  fine: {
    adultOrYouthOnly: FINES_MAC__DEFENDANT_TYPES_STATE['adultOrYouthOnly'],
    parentOrGuardianToPay: FINES_MAC__DEFENDANT_TYPES_STATE['parentOrGuardianToPay'],
    company: FINES_MAC__DEFENDANT_TYPES_STATE['company'],
  },
  fixedPenalty: {
    adultOrYouthOnly: FINES_MAC__DEFENDANT_TYPES_STATE['adultOrYouthOnly'],
    company: FINES_MAC__DEFENDANT_TYPES_STATE['company'],
  },

  conditionalCaution: {
    adultOrYouthOnly: FINES_MAC__DEFENDANT_TYPES_STATE['adultOrYouthOnly'],
  },
};
