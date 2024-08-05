import { DEFENDANT_TYPES_STATE } from '@constants';
import { IAccountTypeDefendantTypes } from '@interfaces';

export const ACCOUNT_TYPE_DEFENDANT_TYPES_STATE: IAccountTypeDefendantTypes = {
  fine: {
    adultOrYouthOnly: DEFENDANT_TYPES_STATE['adultOrYouthOnly'],
    parentOrGuardianToPay: DEFENDANT_TYPES_STATE['parentOrGuardianToPay'],
    company: DEFENDANT_TYPES_STATE['company'],
  },
  fixedPenalty: {
    adultOrYouthOnly: DEFENDANT_TYPES_STATE['adultOrYouthOnly'],
    company: DEFENDANT_TYPES_STATE['company'],
  },

  conditionalCaution: {
    adultOrYouthOnly: DEFENDANT_TYPES_STATE['adultOrYouthOnly'],
  },
};
