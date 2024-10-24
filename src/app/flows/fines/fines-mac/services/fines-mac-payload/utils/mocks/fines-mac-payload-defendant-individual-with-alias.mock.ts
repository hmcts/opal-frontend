import { IFinesMacDefendantIndividualPayload } from '../../interfaces/fines-mac-individual-defendant.interface';
import { FINES_MAC_PAYLOAD_DEFENDANT_INDIVIDUAL_MOCK } from './fines-mac-payload-defendant-individual.mock';

export const FINES_MAC_PAYLOAD_DEFENDANT_INDIVIDUAL_WITH_ALIAS_MOCK: IFinesMacDefendantIndividualPayload = {
  ...FINES_MAC_PAYLOAD_DEFENDANT_INDIVIDUAL_MOCK,
  debtor_detail: {
    ...FINES_MAC_PAYLOAD_DEFENDANT_INDIVIDUAL_MOCK.debtor_detail,
    aliases: [
      {
        alias_forenames: 'Testing',
        alias_surname: 'Test',
      },
    ],
  },
};
