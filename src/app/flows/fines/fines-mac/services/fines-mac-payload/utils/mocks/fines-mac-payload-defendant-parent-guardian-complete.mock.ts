import { FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD } from '../../constants/fines-mac-defendant-debtor-details-payload.constant';
import { FINES_MAC_DEFENDANT_PARENT_GUARDIAN_PAYLOAD } from '../../constants/fines-mac-defendant-parent-guardian-payload.constant';
import { FINES_MAC_DEFENDANT_PAYLOAD } from '../../constants/fines-mac-defendant-payload.constant';
import { IFinesMacDefendantCompletePayload } from '../../interfaces/fines-mac-defendant-complete-payload.interface';
import { FINES_MAC_PAYLOAD_DEFENDANT_PARENT_GUARDIAN_MOCK } from './fines-mac-payload-defendant-parent-guardian.mock';

export const FINES_MAC_PAYLOAD_DEFENDANT_PARENT_GUARDIAN_COMPLETE_MOCK: IFinesMacDefendantCompletePayload = {
  ...FINES_MAC_DEFENDANT_PAYLOAD,
  ...FINES_MAC_PAYLOAD_DEFENDANT_PARENT_GUARDIAN_MOCK,
  parent_guardian: {
    ...FINES_MAC_DEFENDANT_PARENT_GUARDIAN_PAYLOAD,
    ...FINES_MAC_PAYLOAD_DEFENDANT_PARENT_GUARDIAN_MOCK.parent_guardian,
    debtor_detail: {
      ...FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD,
      ...FINES_MAC_PAYLOAD_DEFENDANT_PARENT_GUARDIAN_MOCK.parent_guardian.debtor_detail,
      aliases: null,
    },
  },
};
