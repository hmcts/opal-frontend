import { IOpalFinesAccountDefendantAccountParty } from '../interfaces/opal-fines-account-defendant-account-party.interface';

export const OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_PARENT_OR_GUARDIAN_TAB_REF_DATA_MOCK: IOpalFinesAccountDefendantAccountParty =
  {
    version: '0',
    defendant_account_party: {
      defendant_account_party_type: 'PRIMARY',
      is_debtor: false,
      party_details: {
        party_id: 'PTY-1001',
        organisation_flag: false,
        organisation_details: {
          organisation_name: 'Acme Corporation',
          organisation_aliases: [
            {
              alias_id: 'AL-2001',
              sequence_number: 1,
              organisation_name: 'Acme Corp',
            },
          ],
        },
        individual_details: {
          title: 'Ms',
          forenames: 'Sarah Jane',
          surname: 'Thompson',
          date_of_birth: '12/04/2010',
          age: '36',
          national_insurance_number: 'QQ123456C',
          individual_aliases: [
            {
              alias_number: '1',
              sequence_number: 1,
              alias_surname: 'Taylor',
              alias_forenames: 'S. J.',
            },
            {
              alias_number: '2',
              sequence_number: 2,
              alias_surname: 'Peters',
              alias_forenames: 'John',
            },
          ],
        },
      },
      address: {
        address_line_1: '45 High Street',
        address_line_2: 'Flat 2B',
        address_line_3: null,
        address_line_4: null,
        address_line_5: null,
        postcode: 'AB1 2CD',
      },
      contact_details: {
        primary_email_address: 'sarah.thompson@example.com',
        secondary_email_address: 'sarah.t@example.com',
        mobile_telephone_number: '07123456789',
        home_telephone_number: '01234567890',
        work_telephone_number: '09876543210',
      },
      vehicle_details: {
        vehicle_registration: 'XY21 ABC',
        vehicle_make_and_model: 'Ford Focus',
      },
      employer_details: {
        employer_name: 'Tech Solutions Ltd',
        employer_reference: 'EMP-001234',
        employer_email_address: 'hr@techsolutions.com',
        employer_telephone_number: '01234567890',
        employer_address: {
          address_line_1: '200 Innovation Park',
          address_line_2: null,
          address_line_3: null,
          address_line_4: null,
          address_line_5: null,
          postcode: 'CD3 4EF',
        },
      },
      language_preferences: {
        document_language_preference: {
          language_code: 'CY',
          language_display_name: 'Welsh and English',
        },
        hearing_language_preference: {
          language_code: 'CY',
          language_display_name: 'Welsh and English',
        },
      },
    },
  };
