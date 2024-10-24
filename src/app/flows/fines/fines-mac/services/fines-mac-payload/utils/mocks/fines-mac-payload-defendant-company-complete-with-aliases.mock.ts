import { IFinesMacDefendantCompletePayload } from '../../interfaces/fines-mac-defendant-complete-payload.interface';
import { FINES_MAC_DEFENDANT_PAYLOAD } from '../../constants/fines-mac-defendant-payload.constant';
import { FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD } from '../../constants/fines-mac-defendant-debtor-details-payload.constant';
import { FINES_MAC_PAYLOAD_DEFENDANT_COMPANY_WITH_ALIASES_MOCK } from './fines-mac-payload-defendant-company-with-aliases.mock';

const aliases = FINES_MAC_PAYLOAD_DEFENDANT_COMPANY_WITH_ALIASES_MOCK.debtor_detail.aliases || [];
const completeAliases = [
  {
    alias_forenames: null,
    alias_surname: null,
    ...aliases[0],
  },
];

export const FINES_MAC_PAYLOAD_DEFENDANT_COMPANY_COMPLETE_WITH_ALIASES_MOCK: IFinesMacDefendantCompletePayload = {
  ...FINES_MAC_DEFENDANT_PAYLOAD,
  ...FINES_MAC_PAYLOAD_DEFENDANT_COMPANY_WITH_ALIASES_MOCK,
  debtor_detail: {
    ...FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD,
    ...FINES_MAC_PAYLOAD_DEFENDANT_COMPANY_WITH_ALIASES_MOCK.debtor_detail,
    aliases: completeAliases,
  },
};
