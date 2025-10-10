import { FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES } from '../constants/fines-acc-debtor-add-amend-party-types.constant';

export type FinesAccDebtorAddAmendPartyType =
  (typeof FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES)[keyof typeof FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES];
