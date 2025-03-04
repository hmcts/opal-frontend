import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_DEBTOR_DETAILS } from '../../constants/fines-mac-payload-account-defendant-debtor-details.constant';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN } from '../../constants/fines-mac-payload-account-defendant-parent-guardian.constant';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT } from '../../constants/fines-mac-payload-account-defendant.constant';
import { IFinesMacPayloadAccountDefendantComplete } from '../interfaces/fines-mac-payload-account-defendant-complete.interface';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_WITH_ALIAS_MOCK } from './fines-mac-payload-account-defendant-parent-guardian-with-alias.mock';

export const FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_COMPLETE_WITH_ALIAS_MOCK: IFinesMacPayloadAccountDefendantComplete =
  {
    ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT,
    ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_WITH_ALIAS_MOCK,
    debtor_detail: null,
    parent_guardian: {
      ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN,
      ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_WITH_ALIAS_MOCK.parent_guardian,
      debtor_detail: {
        ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_DEBTOR_DETAILS,
        ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_WITH_ALIAS_MOCK.parent_guardian.debtor_detail,
        aliases: [
          {
            alias_company_name: null,
            alias_forenames: 'Rebecca',
            alias_surname: 'Johnson',
          },
        ],
      },
    },
  };
