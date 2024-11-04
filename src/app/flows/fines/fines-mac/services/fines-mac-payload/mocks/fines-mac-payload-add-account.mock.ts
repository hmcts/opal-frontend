import { IFinesMacAddAccountPayload } from '../interfaces/fines-mac-payload-add-account.interfaces';
import { FINES_MAC_PAYLOAD_ACCOUNT_MOCK } from './fines-mac-payload-account.mock';

export const FINES_MAC_PAYLOAD_ADD_ACCOUNT: IFinesMacAddAccountPayload = {
  business_unit_id: 0,
  submitted_by: null,
  submitted_by_name: 'Timmy Test',
  account: {
    ...FINES_MAC_PAYLOAD_ACCOUNT_MOCK,
  },
  account_type: 'conditionalCaution',
  account_status: 'submitted',
  timeline_data: null,
};
