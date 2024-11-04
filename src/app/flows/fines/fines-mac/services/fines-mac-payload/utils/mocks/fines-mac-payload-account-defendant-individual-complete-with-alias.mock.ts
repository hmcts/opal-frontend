import { FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD } from '../../constants/fines-mac-defendant-debtor-details-payload.constant';
import { FINES_MAC_DEFENDANT_PAYLOAD } from '../../constants/fines-mac-defendant-payload.constant';
import { IFinesMacPayloadAccountDefendantComplete } from '../interfaces/fines-mac-payload-defendant-complete.interface';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_WITH_ALIAS_MOCK } from './fines-mac-payload-account-defendant-individual-with-alias.mock';

export const FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_COMPLETE_WITH_ALIAS_MOCK: IFinesMacPayloadAccountDefendantComplete =
  {
    ...FINES_MAC_DEFENDANT_PAYLOAD,
    ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_WITH_ALIAS_MOCK,
    debtor_detail: {
      ...FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD,
      ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_WITH_ALIAS_MOCK.debtor_detail,
      aliases: [
        {
          alias_company_name: null,
          alias_forenames: 'Testing',
          alias_surname: 'Test',
        },
      ],
    },
  };
