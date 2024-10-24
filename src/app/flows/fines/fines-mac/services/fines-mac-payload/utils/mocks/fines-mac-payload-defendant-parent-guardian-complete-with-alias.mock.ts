import { FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD } from '../../constants/fines-mac-defendant-debtor-details-payload.constant';
import { FINES_MAC_DEFENDANT_PARENT_GUARDIAN_PAYLOAD } from '../../constants/fines-mac-defendant-parent-guardian-payload.constant';
import { FINES_MAC_DEFENDANT_PAYLOAD } from '../../constants/fines-mac-defendant-payload.constant';
import { IFinesMacDefendantCompletePayload } from '../../interfaces/fines-mac-defendant-complete-payload.interface';
import { FINES_MAC_PAYLOAD_DEFENDANT_PARENT_GUARDIAN_WITH_ALIAS_MOCK } from './fines-mac-payload-defendant-parent-guardian-with-alias.mock';

const aliases = FINES_MAC_PAYLOAD_DEFENDANT_PARENT_GUARDIAN_WITH_ALIAS_MOCK.parent_guardian.debtor_detail.aliases || [];
const completeAliases = [
  {
    alias_company_name: null,
    ...aliases[0],
  },
];

export const FINES_MAC_PAYLOAD_DEFENDANT_PARENT_GUARDIAN_COMPLETE_WITH_ALIAS_MOCK: IFinesMacDefendantCompletePayload = {
  ...FINES_MAC_DEFENDANT_PAYLOAD,
  ...FINES_MAC_PAYLOAD_DEFENDANT_PARENT_GUARDIAN_WITH_ALIAS_MOCK,

  parent_guardian: {
    ...FINES_MAC_DEFENDANT_PARENT_GUARDIAN_PAYLOAD,
    ...FINES_MAC_PAYLOAD_DEFENDANT_PARENT_GUARDIAN_WITH_ALIAS_MOCK.parent_guardian,
    debtor_detail: {
      ...FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD,
      ...FINES_MAC_PAYLOAD_DEFENDANT_PARENT_GUARDIAN_WITH_ALIAS_MOCK.parent_guardian.debtor_detail,
      aliases: completeAliases,
    },
  },
};
