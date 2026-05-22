import { IOpalFinesDraftAccountPatchRequestPayload } from '../types/opal-fines-draft-account-patch-request-payload.type';

export const OPAL_FINES_PATCH_DELETE_ACCOUNT_PAYLOAD_MOCK: IOpalFinesDraftAccountPatchRequestPayload = {
  validated_by: null,
  account_status: 'Deleted',
  validated_by_name: null,
  business_unit_id: 123,
  version: '1',
  reason_text: 'Delete reason',
};
