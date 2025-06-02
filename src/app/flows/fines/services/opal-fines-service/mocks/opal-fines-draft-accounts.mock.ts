import { IOpalFinesDraftAccountsResponse } from '../interfaces/opal-fines-draft-account-data.interface';

export const OPAL_FINES_DRAFT_ACCOUNTS_MOCK: IOpalFinesDraftAccountsResponse = {
  count: 2,
  summaries: [
    {
      draft_account_id: 101,
      created_at: '2023-01-01T10:00:00Z',
      submitted_by: 'user1',
      business_unit_id: 1,
      account_snapshot: {
        account_type: 'TYPE_A',
        created_date: '2023-01-01',
        submitted_by: 'user1',
        defendant_name: 'John Doe',
        submitted_by_name: 'User One',
        business_unit_name: 'Business Unit A',
        date_of_birth: '1990-05-15',
      },
      account_type: 'TYPE_A',
      account_status: 'ACTIVE',
      account_status_date: '2023-01-01',
    },
    {
      draft_account_id: 102,
      created_at: '2023-01-02T11:30:00Z',
      submitted_by: 'user2',
      business_unit_id: 2,
      account_snapshot: {
        account_type: 'TYPE_B',
        created_date: '2023-01-02',
        submitted_by: 'user2',
        defendant_name: 'Jane Smith',
        submitted_by_name: 'User Two',
        business_unit_name: 'Business Unit B',
        date_of_birth: null,
      },
      account_type: 'TYPE_B',
      account_status: 'PENDING',
      account_status_date: '2023-01-02',
    },
  ],
};
