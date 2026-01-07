import { IOpalFinesAccountDefendantAccountParty } from '../../../../../src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';

/**
 * Minimal individual defendant mock with only required fields
 */
export const VIEW_AND_AMEND_DEFENDANT_INDIVIDUAL_MINIMAL_MOCK: IOpalFinesAccountDefendantAccountParty = {
  version: null,
  defendant_account_party: {
    defendant_account_party_type: 'PRIMARY',
    is_debtor: true,
    party_details: {
      party_id: 'PTY-1002',
      organisation_flag: false,
      organisation_details: null,
      individual_details: {
        title: 'Ms',
        forenames: 'Jane',
        surname: 'Doe',
        date_of_birth: '01/12/1990',
        age: '33',
        national_insurance_number: null,
        individual_aliases: [],
      },
    },
    address: {
      address_line_1: '10 Short Street',
      address_line_2: null,
      address_line_3: null,
      address_line_4: null,
      address_line_5: null,
      postcode: 'M1 1AA',
    },
    contact_details: {
      primary_email_address: null,
      secondary_email_address: null,
      mobile_telephone_number: null,
      home_telephone_number: null,
      work_telephone_number: null,
    },
    vehicle_details: {
      vehicle_make_and_model: null,
      vehicle_registration: null,
    },
    employer_details: {
      employer_name: null,
      employer_reference: null,
      employer_email_address: null,
      employer_telephone_number: null,
      employer_address: {
        address_line_1: '',
        address_line_2: null,
        address_line_3: null,
        address_line_4: null,
        address_line_5: null,
        postcode: null,
      },
    },
    language_preferences: {
      document_language_preference: {
        language_code: 'EN',
        language_display_name: 'English only',
      },
      hearing_language_preference: {
        language_code: 'EN',
        language_display_name: 'English only',
      },
    },
  },
};
