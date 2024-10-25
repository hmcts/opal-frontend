import { IFinesMacPayloadDefendantCompany } from '../interfaces/fines-mac-payload-defendant-company.interface';
import { FINES_MAC_PAYLOAD_DEFENDANT_COMPANY_MOCK } from './fines-mac-payload-defendant-company.mock';

export const FINES_MAC_PAYLOAD_DEFENDANT_COMPANY_WITH_ALIASES_MOCK: IFinesMacPayloadDefendantCompany = {
  ...FINES_MAC_PAYLOAD_DEFENDANT_COMPANY_MOCK,
  debtor_detail: {
    ...FINES_MAC_PAYLOAD_DEFENDANT_COMPANY_MOCK.debtor_detail,
    aliases: [
      {
        alias_company_name: 'Boring Co.',
      },
    ],
  },
};
