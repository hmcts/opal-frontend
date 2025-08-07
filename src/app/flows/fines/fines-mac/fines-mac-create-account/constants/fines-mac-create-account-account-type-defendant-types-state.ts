import { FINES_MAC_DEFENDANT_TYPES_KEYS } from '../../constants/fines-mac-defendant-types-keys';
import { IFinesMacAccountTypeDefendantTypes } from '../../interfaces/fines-mac-account-type-defendant-types.interface';
import { FINES_MAC_CREATE_ACCOUNT_DEFENDANT_TYPES } from '../constants/fines-mac-create-account-defendant-types';

export const FINES_MAC_CREATE_ACCOUNT_ACCOUNT_TYPE_DEFENDANT_TYPES_STATE: IFinesMacAccountTypeDefendantTypes = {
  Fine: {
    adultOrYouthOnly: FINES_MAC_CREATE_ACCOUNT_DEFENDANT_TYPES[FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly],
    parentOrGuardianToPay:
      FINES_MAC_CREATE_ACCOUNT_DEFENDANT_TYPES[FINES_MAC_DEFENDANT_TYPES_KEYS.parentOrGuardianToPay],
    company: FINES_MAC_CREATE_ACCOUNT_DEFENDANT_TYPES[FINES_MAC_DEFENDANT_TYPES_KEYS.company],
  },
  'Fixed Penalty': {
    adultOrYouthOnly: FINES_MAC_CREATE_ACCOUNT_DEFENDANT_TYPES[FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly],
    company: FINES_MAC_CREATE_ACCOUNT_DEFENDANT_TYPES[FINES_MAC_DEFENDANT_TYPES_KEYS.company],
  },

  'Conditional Caution': {
    adultOrYouthOnly: FINES_MAC_CREATE_ACCOUNT_DEFENDANT_TYPES[FINES_MAC_DEFENDANT_TYPES_KEYS.adultOrYouthOnly],
  },
};
