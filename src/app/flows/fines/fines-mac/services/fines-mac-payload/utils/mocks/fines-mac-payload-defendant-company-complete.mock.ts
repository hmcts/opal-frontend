import { FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD } from '../../constants/fines-mac-defendant-debtor-details-payload.constant';
import { FINES_MAC_DEFENDANT_PAYLOAD } from '../../constants/fines-mac-defendant-payload.constant';
import { IFinesMacDefendantCompletePayload } from '../../interfaces/fines-mac-defendant-complete-payload.interface';

export const FINES_MAC_PAYLOAD_DEFENDANT_COMPANY_COMPLETE_MOCK: IFinesMacDefendantCompletePayload = {
  ...FINES_MAC_DEFENDANT_PAYLOAD,
  company_flag: true,
  organisation_name: 'Acme Org Ltd.',
  address_line_1: '123 Street',
  address_line_2: 'City',
  address_line_3: 'County',
  post_code: 'AB12 3CD',
  telephone_number_home: '12345678910',
  telephone_number_business: '12345678910',
  telephone_number_mobile: '12345678910',
  email_address_1: 'abc@def.co.uk',
  email_address_2: 'abc@def.co.uk',
  debtor_detail: {
    ...FINES_MAC_DEFENDANT_DEBTOR_DETAILS_PAYLOAD,
    document_language: 'welshEnglish',
    hearing_language: 'welshEnglish',
  },
};
