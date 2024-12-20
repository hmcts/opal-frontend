import { IFinesMacPayloadAccountDefendantCompany } from '../interfaces/fines-mac-payload-account-defendant-company.interface';

export const FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_COMPANY_MOCK: IFinesMacPayloadAccountDefendantCompany = {
  company_flag: true,
  organisation_name: 'NexGen Solutions Ltd.',
  address_line_1: '789 Innovation Drive',
  address_line_2: 'Tech Park',
  address_line_3: 'Westshire',
  post_code: 'XY45 6ZT',
  telephone_number_home: '01412345678',
  telephone_number_business: '02079461234',
  telephone_number_mobile: '07900112233',
  email_address_1: 'contact.primary@example.com',
  email_address_2: 'contact.secondary@example.com',
  debtor_detail: {
    document_language: 'welshEnglish',
    hearing_language: 'welshEnglish',
    aliases: null,
  },
};
