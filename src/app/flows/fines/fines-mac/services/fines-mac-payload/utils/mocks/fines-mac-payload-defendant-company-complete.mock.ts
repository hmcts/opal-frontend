import { FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD } from '../../constants/fines-mac-defendant-debtor-details-payload.constant';
import { FINES_MAC_DEFENDANT_PAYLOAD } from '../../constants/fines-mac-defendant-payload.constant';
import { IFinesMacPayloadDefendantComplete } from '../../interfaces/fines-mac-payload-defendant-complete.interface';
import { FINES_MAC_PAYLOAD_DEFENDANT_COMPANY_MOCK } from './fines-mac-payload-defendant-company.mock';

export const FINES_MAC_PAYLOAD_DEFENDANT_COMPANY_COMPLETE_MOCK: IFinesMacPayloadDefendantComplete = {
  ...FINES_MAC_DEFENDANT_PAYLOAD,
  ...FINES_MAC_PAYLOAD_DEFENDANT_COMPANY_MOCK,
  debtor_detail: {
    ...FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD,
    ...FINES_MAC_PAYLOAD_DEFENDANT_COMPANY_MOCK.debtor_detail,
    aliases: null,
  },
};
