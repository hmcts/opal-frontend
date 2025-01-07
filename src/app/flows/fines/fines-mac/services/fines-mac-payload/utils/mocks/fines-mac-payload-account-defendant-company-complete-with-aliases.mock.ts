import { IFinesMacPayloadAccountDefendantComplete } from '../interfaces/fines-mac-payload-account-defendant-complete.interface';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT } from '../../constants/fines-mac-payload-account-defendant.constant';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_DEBTOR_DETAILS } from '../../constants/fines-mac-payload-account-defendant-debtor-details.constant';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_WITH_ALIASES_MOCK } from '../mocks/fines-mac-payload-account-defendant-company-with-aliases.mock';

export const FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_COMPLETE_WITH_ALIASES_MOCK: IFinesMacPayloadAccountDefendantComplete =
  {
    ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT,
    ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_WITH_ALIASES_MOCK,
    debtor_detail: {
      ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_DEBTOR_DETAILS,
      ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_WITH_ALIASES_MOCK.debtor_detail,
      aliases: [
        {
          alias_forenames: null,
          alias_surname: null,
          alias_company_name: 'Bright Innovations Ltd',
        },
      ],
    },
    parent_guardian: null,
  };
