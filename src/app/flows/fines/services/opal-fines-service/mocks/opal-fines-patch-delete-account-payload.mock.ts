import { IOpalFinesDraftAccountPatchRequestPayload } from '../interfaces/opal-fines-draft-account-patch-request-payload.interface';

export const OPAL_FINES_PATCH_DELETE_ACCOUNT_PAYLOAD_MOCK: IOpalFinesDraftAccountPatchRequestPayload = {
  account_status: 'Deleted',
  business_unit_id: 123,
  reason_text: 'Delete reason',
};
