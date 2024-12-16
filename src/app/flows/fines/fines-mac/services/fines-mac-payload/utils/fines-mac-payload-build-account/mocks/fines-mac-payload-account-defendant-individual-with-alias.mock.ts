import { IFinesMacPayloadBuildAccountDefendantIndividual } from '../interfaces/fines-mac-payload-build-account-individual-defendant.interface';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_MOCK } from './fines-mac-payload-account-defendant-individual.mock';

export const FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_WITH_ALIAS_MOCK: IFinesMacPayloadBuildAccountDefendantIndividual =
  {
    ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_MOCK,
    debtor_detail: {
      ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_MOCK.debtor_detail,
      aliases: [
        {
          alias_forenames: 'Rebecca',
          alias_surname: 'Johnson',
        },
      ],
    },
  };
