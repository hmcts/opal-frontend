import { IOpalFinesDraftAccountPatchPayload } from '../interfaces/opal-fines-draft-account.interface';

export const OPAL_FINES_DRAFT_ACCOUNTS_PATCH_PAYLOAD: IOpalFinesDraftAccountPatchPayload = {
  account_status: 'Rejected',
  business_unit_id: 1,
  reason_text: 'Test reason for rejection',
  timeline_data: [
    {
      username: 'opal-test',
      status: 'Submitted',
      status_date: '2024-12-06',
      reason_text: null,
    },
    {
      username: 'opal-test',
      status: 'Rejected',
      status_date: '2024-12-07',
      reason_text: 'Test reason for rejection',
    },
  ],
  validated_by: 'testUser',
  validated_by_name: 'Test User',
  version: 1,
};
