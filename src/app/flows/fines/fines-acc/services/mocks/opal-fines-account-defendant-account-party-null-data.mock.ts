import { IOpalFinesAccountDefendantAccountParty } from '../../../services/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';

/**
 * Mock data with all nullable fields set to null and required fields set to empty strings.
 * Useful for testing how the transformation handles completely empty/null values.
 * Can be spread with specific values to create targeted test scenarios.
 */
export const OPAL_FINES_ACCOUNT_DEFENDANT_ACCOUNT_PARTY_EMPTY_DATA_MOCK: IOpalFinesAccountDefendantAccountParty = {
  version: null,
  defendant_account_id: '',
  defendant_account_party: {
    defendant_account_party_type: '',
    is_debtor: false,
    party_details: {
      party_id: '',
      organisation_flag: false,
      organisation_details: null,
      individual_details: {
        title: null,
        forenames: null,
        surname: '', // Required field - empty string
        date_of_birth: null,
        age: null,
        national_insurance_number: null,
        individual_aliases: [],
      },
    },
    address: {
      address_line_1: '', // Required field - empty string
      address_line_2: null,
      address_line_3: null,
      address_line_4: null,
      address_line_5: null,
      postcode: null,
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
        address_line_1: '', // Required field - empty string
        address_line_2: null,
        address_line_3: null,
        address_line_4: null,
        address_line_5: null,
        postcode: null,
      },
    },
    language_preferences: {
      document_language_preference: null,
      hearing_language_preference: null,
    },
  },
};
