import { IOpalFinesEnforcementAccountTypesResponse } from '../interfaces/opal-fines-enforcement-account-types-response.interface';

export const OPAL_FINES_ENFORCEMENT_ACCOUNT_TYPES_MOCK: IOpalFinesEnforcementAccountTypesResponse = {
  enforcement_account_types: [
    { id: 1, version: 1, account_type: 'COL', enforcement_account_type: 'COLH', path: 'H', minimum_balance: 1000 },
    { id: 2, version: 2, account_type: 'COL', enforcement_account_type: 'COLL', path: 'L', minimum_balance: 100 },
    { id: 3, version: 3, account_type: 'A', enforcement_account_type: 'AH', path: 'H', minimum_balance: null },
    { id: 4, version: 4, account_type: 'A', enforcement_account_type: 'AL', path: 'L', minimum_balance: 75 },
    { id: 5, version: 5, account_type: 'CO', enforcement_account_type: 'COH', path: 'H', minimum_balance: 500 },
    { id: 6, version: 6, account_type: 'CO', enforcement_account_type: 'COL', path: 'L', minimum_balance: 25 },
    { id: 7, version: 7, account_type: 'Y', enforcement_account_type: 'YH', path: 'H', minimum_balance: 200 },
    { id: 8, version: 8, account_type: 'Y', enforcement_account_type: 'YL', path: 'L', minimum_balance: 50 },
  ],
};
