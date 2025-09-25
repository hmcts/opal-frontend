export const FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES = {
  INDIVIDUAL: 'individual',
  COMPANY: 'company',
  PARENT_GUARDIAN: 'parentGuardian',
} as const;

export type FinesAccDebtorAddAmendPartyType =
  (typeof FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES)[keyof typeof FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES];