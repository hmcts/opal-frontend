import { FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD } from '../../constants/fines-mac-defendant-debtor-details-payload.constant';
import { FINES_MAC_DEFENDANT_PAYLOAD } from '../../constants/fines-mac-defendant-payload.constant';
import { IFinesMacPayloadAccountDefendantComplete } from '../interfaces/fines-mac-payload-defendant-complete.interface';
import { FINES_MAC_PAYLOAD_DEFENDANT_INDIVIDUAL_MOCK } from './fines-mac-payload-defendant-individual.mock';

export const FINES_MAC_PAYLOAD_DEFENDANT_INDIVIDUAL_COMPLETE_MOCK: IFinesMacPayloadAccountDefendantComplete = {
  ...FINES_MAC_DEFENDANT_PAYLOAD,
  ...FINES_MAC_PAYLOAD_DEFENDANT_INDIVIDUAL_MOCK,
  debtor_detail: {
    ...FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD,
    ...FINES_MAC_PAYLOAD_DEFENDANT_INDIVIDUAL_MOCK.debtor_detail,
    aliases: null,
  },
};
