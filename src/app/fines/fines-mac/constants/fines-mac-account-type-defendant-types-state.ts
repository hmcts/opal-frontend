import { IFinesMacAccountTypeDefendantTypes } from '../interfaces';
import { FINES_MAC_DEFENDANT_TYPES_STATE } from './fines-mac-defendant-types-state';

export const FINES_MAC_ACCOUNT_TYPE_DEFENDANT_TYPES_STATE: IFinesMacAccountTypeDefendantTypes = {
  fine: {
    adultOrYouthOnly: FINES_MAC_DEFENDANT_TYPES_STATE['adultOrYouthOnly'],
    parentOrGuardianToPay: FINES_MAC_DEFENDANT_TYPES_STATE['parentOrGuardianToPay'],
    company: FINES_MAC_DEFENDANT_TYPES_STATE['company'],
  },
  fixedPenalty: {
    adultOrYouthOnly: FINES_MAC_DEFENDANT_TYPES_STATE['adultOrYouthOnly'],
    company: FINES_MAC_DEFENDANT_TYPES_STATE['company'],
  },

  conditionalCaution: {
    adultOrYouthOnly: FINES_MAC_DEFENDANT_TYPES_STATE['adultOrYouthOnly'],
  },
};
