import { IFinesMacPayloadDefendantIndividual } from '../../interfaces/fines-mac-payload-individual-defendant.interface';
import { FINES_MAC_PAYLOAD_DEFENDANT_INDIVIDUAL_MOCK } from './fines-mac-payload-defendant-individual.mock';

export const FINES_MAC_PAYLOAD_DEFENDANT_INDIVIDUAL_WITH_ALIAS_MOCK: IFinesMacPayloadDefendantIndividual = {
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
