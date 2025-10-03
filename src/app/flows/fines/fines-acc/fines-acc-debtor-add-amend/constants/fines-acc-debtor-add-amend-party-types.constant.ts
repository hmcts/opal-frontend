import { FinesAccDebtorAddAmendPartyTypes } from '../interfaces/fines-acc-debtor-add-amend-party-types.interface';

export const FINES_ACC_DEBTOR_ADD_AMEND_PARTY_TYPES: FinesAccDebtorAddAmendPartyTypes = {
  INDIVIDUAL: 'individual',
  COMPANY: 'company',
  PARENT_GUARDIAN: 'parentGuardian',
} as const;
