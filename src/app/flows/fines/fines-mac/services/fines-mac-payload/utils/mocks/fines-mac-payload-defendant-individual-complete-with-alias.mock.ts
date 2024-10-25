import { FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD } from '../../constants/fines-mac-defendant-debtor-details-payload.constant';
import { FINES_MAC_DEFENDANT_PAYLOAD } from '../../constants/fines-mac-defendant-payload.constant';
import { IFinesMacDefendantCompletePayload } from '../../interfaces/fines-mac-defendant-complete-payload.interface';
import { FINES_MAC_PAYLOAD_DEFENDANT_INDIVIDUAL_WITH_ALIAS_MOCK } from './fines-mac-payload-defendant-individual-with-alias.mock';

const aliases = FINES_MAC_PAYLOAD_DEFENDANT_INDIVIDUAL_WITH_ALIAS_MOCK.debtor_detail.aliases;
const completeAliases = [
  {
    alias_company_name: null,
    alias_forenames: aliases && aliases[0].alias_forenames !== undefined ? aliases[0].alias_forenames : null,
    alias_surname: aliases && aliases[0].alias_surname !== undefined ? aliases[0].alias_surname : null,
  },
];

export const FINES_MAC_PAYLOAD_DEFENDANT_INDIVIDUAL_COMPLETE_WITH_ALIAS_MOCK: IFinesMacDefendantCompletePayload = {
  ...FINES_MAC_DEFENDANT_PAYLOAD,
  ...FINES_MAC_PAYLOAD_DEFENDANT_INDIVIDUAL_WITH_ALIAS_MOCK,
  debtor_detail: {
    ...FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD,
    ...FINES_MAC_PAYLOAD_DEFENDANT_INDIVIDUAL_WITH_ALIAS_MOCK.debtor_detail,
    aliases: completeAliases,
  },
};
