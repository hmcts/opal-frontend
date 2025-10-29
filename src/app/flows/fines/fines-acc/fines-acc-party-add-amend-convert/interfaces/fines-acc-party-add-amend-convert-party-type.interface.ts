import { FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES } from '../constants/fines-acc-party-add-amend-convert-party-types.constant';

export type FinesAccPartyAddAmendConvertPartyType =
  (typeof FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES)[keyof typeof FINES_ACC_PARTY_ADD_AMEND_CONVERT_PARTY_TYPES];
