import { IFinesMacPayloadAccountDefendantComplete } from '../interfaces/fines-mac-payload-account-defendant-complete.interface';
import { FINES_MAC_DEFENDANT_PAYLOAD } from '../../constants/fines-mac-defendant-payload.constant';
import { FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD } from '../../constants/fines-mac-defendant-debtor-details-payload.constant';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_WITH_ALIASES_MOCK } from './fines-mac-payload-account-defendant-company-with-aliases.mock';

export const FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_COMPLETE_WITH_ALIASES_MOCK: IFinesMacPayloadAccountDefendantComplete =
  {
    ...FINES_MAC_DEFENDANT_PAYLOAD,
    ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_WITH_ALIASES_MOCK,
    debtor_detail: {
      ...FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD,
      ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_WITH_ALIASES_MOCK.debtor_detail,
      aliases: [
        {
          alias_forenames: null,
          alias_surname: null,
          alias_company_name: 'Boring Co.',
        },
      ],
    },
  };
