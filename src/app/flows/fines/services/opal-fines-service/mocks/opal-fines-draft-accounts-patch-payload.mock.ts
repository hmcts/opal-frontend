import { IOpalFinesDraftAccountPatchRequestPayload } from '../types/opal-fines-draft-account-patch-request-payload.type';

export const OPAL_FINES_DRAFT_ACCOUNTS_PATCH_PAYLOAD: IOpalFinesDraftAccountPatchRequestPayload = {
  account_status: 'Rejected',
  business_unit_id: 1,
  reason_text: 'Test reason for rejection',
  validated_by: 'testUser',
  validated_by_name: 'Test User',
  version: '1',
};
