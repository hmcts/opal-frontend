import { IFinesMacPayloadAccountDefendantIndividual } from '../interfaces/fines-mac-payload-account-individual-defendant.interface';

export const FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_MOCK: IFinesMacPayloadAccountDefendantIndividual = {
  company_flag: false,
  title: 'Dr',
  surname: 'Williams',
  forenames: 'Alice',
  dob: '15/05/1985',
  address_line_1: '456 Maple Avenue',
  address_line_2: 'Springfield',
  address_line_3: 'Westshire',
  post_code: 'XY45 6ZT',
  telephone_number_home: '01412345678',
  telephone_number_business: '02079461234',
  telephone_number_mobile: '07900112233',
  email_address_1: 'contact.primary@example.com',
  email_address_2: 'contact.secondary@example.com',
  national_insurance_number: 'CD789012E',
  debtor_detail: {
    vehicle_make: 'Toyota',
    vehicle_registration_mark: 'GH456JKL',
    document_language: 'welshEnglish',
    hearing_language: 'welshEnglish',
    employee_reference: 'REF987654',
    employer_company_name: 'Bright Future Ltd.',
    employer_address_line_1: '789 Innovation Street',
    employer_address_line_2: 'Suite 300',
    employer_address_line_3: 'Tech City',
    employer_address_line_4: 'Eastside',
    employer_address_line_5: 'Middleshire',
    employer_post_code: 'BT22 4KL',
    employer_telephone_number: '02012345678',
    employer_email_address: 'contact@brightfuture.com',
    aliases: null,
  },
};