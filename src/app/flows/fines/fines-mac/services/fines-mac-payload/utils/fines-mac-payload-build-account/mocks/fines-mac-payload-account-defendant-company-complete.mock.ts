import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_DEBTOR_DETAILS } from '../../../constants/fines-mac-payload-account-defendant-debtor-details.constant';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT } from '../../../constants/fines-mac-payload-account-defendant.constant';
import { IFinesMacPayloadBuildAccountDefendantComplete } from '../interfaces/fines-mac-payload-build-account-defendant-complete.interface';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_MOCK } from './fines-mac-payload-account-defendant-company.mock';

export const FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_COMPLETE_MOCK: IFinesMacPayloadBuildAccountDefendantComplete =
  {
    ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT,
    ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_MOCK,
    debtor_detail: {
      ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_DEBTOR_DETAILS,
      ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_MOCK.debtor_detail,
      aliases: null,
    },
  };
