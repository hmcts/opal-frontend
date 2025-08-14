import { getDaysAgo, getToday } from 'cypress/support/utils/dateUtils';
import { IOpalFinesDraftAccountsResponse } from '../../../../../../../src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-draft-account-data.interface';
import { FINES_MAC_ACCOUNT_TYPES } from 'src/app/flows/fines/fines-mac/constants/fines-mac-account-types';

export const OPAL_FINES_DRAFT_ACCOUNTS_MOCK: IOpalFinesDraftAccountsResponse = {
  count: 2,
  summaries: [
    {
      draft_account_id: 101,
      created_at: '2023-01-01T10:00:00Z',
      submitted_by: 'user1',
      business_unit_id: 77,
      account_snapshot: {
        account_type: FINES_MAC_ACCOUNT_TYPES.Fine,
        created_date: getToday(),
        submitted_by: 'user1',
        defendant_name: 'DOE, John',
        submitted_by_name: 'User One',
        business_unit_name: 'Business Unit A',
        date_of_birth: '1990-05-15',
      },
      account_type: FINES_MAC_ACCOUNT_TYPES.Fine,
      account_status: 'ACTIVE',
      account_status_date: '2023-01-01',
      account_number: 'FINE123456',
    },
    {
      draft_account_id: 102,
      created_at: '2023-01-02T11:30:00Z',
      submitted_by: 'user2',
      business_unit_id: 17,
      account_snapshot: {
        account_type: FINES_MAC_ACCOUNT_TYPES['Fixed Penalty'],
        created_date: getDaysAgo(4),
        submitted_by: 'user2',
        defendant_name: 'SMITH, Jane',
        submitted_by_name: 'User Two',
        business_unit_name: 'Business Unit B',
        date_of_birth: null,
      },
      account_type: FINES_MAC_ACCOUNT_TYPES['Fixed Penalty'],
      account_status: 'PENDING',
      account_status_date: '2023-01-01',
      account_number: 'FP123456',
    },
  ],
};
