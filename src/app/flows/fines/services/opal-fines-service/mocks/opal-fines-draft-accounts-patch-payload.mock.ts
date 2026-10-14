import { IOpalFinesDraftAccountPatchRequestPayload } from '../interfaces/opal-fines-draft-account-patch-request-payload.interface';

export const OPAL_FINES_DRAFT_ACCOUNTS_PATCH_PAYLOAD_MOCK: IOpalFinesDraftAccountPatchRequestPayload = {
  account_status: 'Rejected',
  business_unit_id: 1,
  reason_text: 'Test reason for rejection',
};
