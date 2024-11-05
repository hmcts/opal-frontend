import { IFinesMacPayloadAccountDefendantCompany } from '../interfaces/fines-mac-payload-account-defendant-company.interface';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_MOCK } from './fines-mac-payload-account-defendant-company.mock';

export const FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_WITH_ALIASES_MOCK: IFinesMacPayloadAccountDefendantCompany = {
  ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_MOCK,
  debtor_detail: {
    ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_MOCK.debtor_detail,
    aliases: [
      {
        alias_company_name: 'Boring Co.',
      },
    ],
  },
};
