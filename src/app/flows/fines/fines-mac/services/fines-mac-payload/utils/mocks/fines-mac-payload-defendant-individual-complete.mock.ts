import { IFinesMacDefendantCompletePayload } from '../../interfaces/fines-mac-defendant-complete-payload.interface';

export const FINES_MAC_PAYLOAD_DEFENDANT_INDIVIDUAL_COMPLETE_MOCK: IFinesMacDefendantCompletePayload = {
  company_flag: false,
  title: 'Mr',
  surname: 'Doe',
  forenames: 'John',
  organisation_name: null,
  dob: '01/01/1990',
  address_line_1: '123 Street',
  address_line_2: 'City',
  address_line_3: 'County',
  address_line_4: null,
  address_line_5: null,
  post_code: 'AB12 3CD',
  telephone_number_home: '12345678910',
  telephone_number_business: '12345678910',
  telephone_number_mobile: '12345678910',
  email_address_1: 'abc@def.co.uk',
  email_address_2: 'abc@def.co.uk',
  national_insurance_number: 'AB123456C',
  driving_licence_number: null,
  pnc_id: null,
  nationality_1: null,
  nationality_2: null,
  ethnicity_self_defined: null,
  ethnicity_observed: null,
  cro_number: null,
  occupation: null,
  gender: null,
  custody_status: null,
  prison_number: null,
  interpreter_lang: null,
  debtor_detail: {
    vehicle_make: 'Ford',
    vehicle_registration_mark: 'AB123CDE',
    document_language: 'welshEnglish',
    hearing_language: 'welshEnglish',
    employee_reference: 'Test Reference',
    employer_company_name: 'Test Employer Name',
    employer_address_line_1: 'Test Employer Address 1',
    employer_address_line_2: 'Test Employer Address 2',
    employer_address_line_3: 'Test Employer Address 3',
    employer_address_line_4: 'Test Employer Address 4',
    employer_address_line_5: 'Test Employer Address 5',
    employer_post_code: 'TE10 1ST',
    employer_telephone_number: '12345678910',
    employer_email_address: 'abc@def.co.uk',
    aliases: null,
  },
  parent_guardian: {
    company_flag: null,
    company_name: null,
    surname: null,
    forenames: null,
    dob: null,
    national_insurance_number: null,
    address_line_1: null,
    address_line_2: null,
    address_line_3: null,
    address_line_4: null,
    address_line_5: null,
    post_code: null,
    telephone_number_home: null,
    telephone_number_business: null,
    telephone_number_mobile: null,
    email_address_1: null,
    email_address_2: null,
    debtor_detail: {
      vehicle_make: null,
      vehicle_registration_mark: null,
      document_language: null,
      hearing_language: null,
      employee_reference: null,
      employer_company_name: null,
      employer_address_line_1: null,
      employer_address_line_2: null,
      employer_address_line_3: null,
      employer_address_line_4: null,
      employer_address_line_5: null,
      employer_post_code: null,
      employer_telephone_number: null,
      employer_email_address: null,
      aliases: null,
    },
  },
};
