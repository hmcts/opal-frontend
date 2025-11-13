import { IOpalFinesAccountDefendantAccountParty } from '../../../../../src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';

/**
 * Full individual defendant mock with all fields populated including aliases
 */
export const VIEW_AND_AMEND_DEFENDANT_INDIVIDUAL_FULL_MOCK: IOpalFinesAccountDefendantAccountParty = {
  version: null,
  defendant_account_party: {
    defendant_account_party_type: 'PRIMARY',
    is_debtor: true,
    party_details: {
      party_id: 'PTY-1001',
      organisation_flag: false,
      organisation_details: null,
      individual_details: {
        title: 'Mr',
        forenames: 'John',
        surname: 'Doe',
        date_of_birth: '01/01/1990',
        age: '34',
        national_insurance_number: 'AB123456C',
        individual_aliases: [
          {
            alias_id: '1',
            sequence_number: 1,
            forenames: 'Johnny',
            surname: 'Smith',
          },
          {
            alias_id: '2',
            sequence_number: 2,
            forenames: 'Jon',
            surname: 'Johnson',
          },
          {
            alias_id: '3',
            sequence_number: 3,
            forenames: 'Test',
            surname: 'Smith',
          },
          {
            alias_id: '4',
            sequence_number: 4,
            forenames: 'Test',
            surname: 'Smith2',
          },
          {
            alias_id: '5',
            sequence_number: 5,
            forenames: 'Test',
            surname: 'Smith3',
          },
        ],
      },
    },
    address: {
      address_line_1: '123 Test Street',
      address_line_2: 'Second Floor',
      address_line_3: 'City Center',
      address_line_4: null,
      address_line_5: null,
      postcode: 'TE5T 1NG',
    },
    contact_details: {
      primary_email_address: 'john@example.com',
      secondary_email_address: 'john.doe@secondary.com',
      mobile_telephone_number: '07123456789',
      home_telephone_number: '01234567890',
      work_telephone_number: '02087654321',
    },
    vehicle_details: {
      vehicle_registration: 'ABC123',
      vehicle_make_and_model: 'Toyota Corolla',
    },
    employer_details: {
      employer_name: 'Test Company',
      employer_reference: 'EMP123',
      employer_email_address: 'hr@company.com',
      employer_telephone_number: '01234567890',
      employer_address: {
        address_line_1: '456 Business Park',
        address_line_2: 'Suite 200',
        address_line_3: 'Industrial Estate',
        address_line_4: 'Business District',
        address_line_5: 'Metropolitan Area',
        postcode: 'BU5 1NE',
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

/**
 * Company/organisation defendant mock with full data
 */
export const VIEW_AND_AMEND_DEFENDANT_COMPANY_FULL_MOCK: IOpalFinesAccountDefendantAccountParty = {
  version: null,
  defendant_account_party: {
    defendant_account_party_type: 'PRIMARY',
    is_debtor: true,
    party_details: {
      party_id: 'PTY-2001',
      organisation_flag: true,
      organisation_details: {
        organisation_name: 'ABC Corporation Ltd',
        organisation_aliases: [
          {
            alias_id: 'AL-3001',
            sequence_number: 1,
            organisation_name: 'ABC Corp',
          },
          {
            alias_id: 'AL-3002',
            sequence_number: 2,
            organisation_name: 'ABC Limited',
          },
          {
            alias_id: 'AL-3003',
            sequence_number: 3,
            organisation_name: 'ABC Trading',
          },
          {
            alias_id: 'AL-3004',
            sequence_number: 4,
            organisation_name: 'ABC Enterprises',
          },
          {
            alias_id: 'AL-3005',
            sequence_number: 5,
            organisation_name: 'ABC Holdings',
          },
        ],
      },
      individual_details: null,
    },
    address: {
      address_line_1: '100 Corporate Plaza',
      address_line_2: '25th Floor',
      address_line_3: 'Financial',
      address_line_4: null,
      address_line_5: null,
      postcode: 'EC2Y 8DS',
    },
    contact_details: {
      primary_email_address: 'contact@abccorporation.co.uk',
      secondary_email_address: 'legal@abccorporation.co.uk',
      mobile_telephone_number: '07900123456',
      home_telephone_number: '02071234567',
      work_telephone_number: '02071234567',
    },
    vehicle_details: {
      vehicle_make_and_model: 'Mercedes Sprinter',
      vehicle_registration: 'ABC123D',
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
