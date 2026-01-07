import { IOpalFinesAccountDefendantAccountParty } from '../../../../../src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';

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
