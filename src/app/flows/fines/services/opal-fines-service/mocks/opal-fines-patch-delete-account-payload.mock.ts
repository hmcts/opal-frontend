import { IOpalFinesDraftAccountPatchPayload } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account.interface';

export const OPAL_FINES_PATCH_DELETE_ACCOUNT_PAYLOAD_MOCK: IOpalFinesDraftAccountPatchPayload = {
  validated_by: null,
  account_status: 'Deleted',
  validated_by_name: null,
  business_unit_id: 123,
  version: 1,
  timeline_data: [
    { username: 'test-user', status: 'Deleted', status_date: '2025-01-01', reason_text: 'Delete reason' },
  ],
  reason_text: 'Delete reason',
};
