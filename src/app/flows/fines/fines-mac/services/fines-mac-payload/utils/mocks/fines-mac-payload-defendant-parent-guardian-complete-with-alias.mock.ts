import { FINES_MAC_DEFENDANT_PARENT_GUARDIAN_PAYLOAD } from '../../constants/fines-mac-defendant-parent-guardian-payload.constant';
import { FINES_MAC_DEFENDANT_PAYLOAD } from '../../constants/fines-mac-defendant-payload.constant';
import { IFinesMacDefendantCompletePayload } from '../../interfaces/fines-mac-defendant-complete-payload.interface';

export const FINES_MAC_PAYLOAD_DEFENDANT_PARENT_GUARDIAN_COMPLETE_WITH_ALIAS_MOCK: IFinesMacDefendantCompletePayload = {
  ...FINES_MAC_DEFENDANT_PAYLOAD,
  company_flag: false,
  title: 'Mr',
  surname: 'Doe',
  forenames: 'John',
  dob: '01/01/1990',
  address_line_1: '123 Street',
  address_line_2: 'City',
  address_line_3: 'County',
  post_code: 'AB12 3CD',
  national_insurance_number: 'AB123456C',

  parent_guardian: {
    ...FINES_MAC_DEFENDANT_PARENT_GUARDIAN_PAYLOAD,
    company_flag: false,
    surname: 'Test Surname',
    forenames: 'Test Forenames',
    dob: '01/01/2023',
    national_insurance_number: 'QQ 12 34 56 C',
    address_line_1: 'Test address line 1',
    address_line_2: 'Test address line 2',
    address_line_3: 'Test line 3',
    post_code: 'TE10 1ST',
    telephone_number_home: '12345678910',
    telephone_number_business: '12345678910',
    telephone_number_mobile: '12345678910',
    email_address_1: 'abc@def.co.uk',
    email_address_2: 'abc@def.co.uk',
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
      aliases: [
        {
          alias_forenames: 'Testing',
          alias_surname: 'Test',
          alias_company_name: null,
        },
      ],
    },
  },
};
