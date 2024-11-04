import { FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD } from '../../constants/fines-mac-defendant-debtor-details-payload.constant';
import { FINES_MAC_DEFENDANT_PARENT_GUARDIAN_PAYLOAD } from '../../constants/fines-mac-defendant-parent-guardian-payload.constant';
import { FINES_MAC_DEFENDANT_PAYLOAD } from '../../constants/fines-mac-defendant-payload.constant';
import { IFinesMacPayloadAccountDefendantComplete } from '../interfaces/fines-mac-payload-account-defendant-complete.interface';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_WITH_ALIAS_MOCK } from './fines-mac-payload-account-defendant-parent-guardian-with-alias.mock';

export const FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_COMPLETE_WITH_ALIAS_MOCK: IFinesMacPayloadAccountDefendantComplete =
  {
    ...FINES_MAC_DEFENDANT_PAYLOAD,
    ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_WITH_ALIAS_MOCK,

    parent_guardian: {
      ...FINES_MAC_DEFENDANT_PARENT_GUARDIAN_PAYLOAD,
      ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_WITH_ALIAS_MOCK.parent_guardian,
      debtor_detail: {
        ...FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD,
        ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN_WITH_ALIAS_MOCK.parent_guardian.debtor_detail,
        aliases: [
          {
            alias_company_name: null,
            alias_forenames: 'Testing',
            alias_surname: 'Test',
          },
        ],
      },
    },
  };