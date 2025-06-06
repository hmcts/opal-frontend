import { IFinesMacPatchAccountPayload } from '../../../fines-mac/services/fines-mac-payload/interfaces/fines-mac-payload-patch-account.interface';

export const OPAL_FINES_PATCH_DELETE_ACCOUNT_PAYLOAD_MOCK: IFinesMacPatchAccountPayload = {
  validated_by: null,
  account_status: 'Deleted',
  validated_by_name: null,
  business_unit_id: 123,
  version: 1,
  timeline_data: [
    { username: 'test-user', status: 'Deleted', status_date: '2025-01-01', reason_text: 'Delete reason' },
  ],
};
