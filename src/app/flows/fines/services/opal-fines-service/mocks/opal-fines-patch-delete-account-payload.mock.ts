import { IOpalFinesDraftAccountPatchRequestPayload } from '@services/fines/opal-fines-service/interfaces/opal-fines-draft-account.interface';

export const OPAL_FINES_PATCH_DELETE_ACCOUNT_PAYLOAD_MOCK: IOpalFinesDraftAccountPatchRequestPayload = {
  validated_by: null,
  account_status: 'Deleted',
  validated_by_name: null,
  business_unit_id: 123,
  version: '1',
  reason_text: 'Delete reason',
};
