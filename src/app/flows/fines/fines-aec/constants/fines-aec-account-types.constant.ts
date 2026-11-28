import { IFinesAecAccountTypeRow } from '../interfaces/fines-aec-account-type-row.interface';

export const FINES_AEC_ACCOUNT_TYPES: readonly Pick<IFinesAecAccountTypeRow, 'accountType' | 'accountTypeName'>[] = [
  { accountType: 'COL', accountTypeName: 'Adult - Collection order' },
  { accountType: 'A', accountTypeName: 'Adult - No collection order' },
  { accountType: 'Y', accountTypeName: 'Youth' },
  { accountType: 'CO', accountTypeName: 'Company' },
];
