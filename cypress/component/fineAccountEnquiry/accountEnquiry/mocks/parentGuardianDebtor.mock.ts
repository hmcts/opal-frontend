import { IOpalFinesAccountDefendantAccountParty } from '../../../../../src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-account-defendant-account-party.interface';

export const OPAL_FINES_ACCOUNT_PARENT_GUARDIAN_PARTY_MOCK: IOpalFinesAccountDefendantAccountParty = {
  version: null,
  defendant_account_party: {
    defendant_account_party_type: 'Parent/Guardian',
    is_debtor: true,
    party_details: {
      party_id: '60000000000121',
      organisation_flag: false,
      organisation_details: null,
      individual_details: {
        forenames: 'Opal parent2',
        surname: 'LNAME',
        national_insurance_number: 'OT000001D',
        individual_aliases: null,
        date_of_birth: null,
        title: 'Mr',
        age: null,
      },
    },
    address: {
      address_line_1: 'PG2 addr1',
      address_line_2: 'PG2 addr2',
      address_line_3: 'PG2 addr3',
      address_line_4: null,
      address_line_5: null,
      postcode: 'PG12 3ST',
    },
    contact_details: {
      primary_email_address: 'PGemail1@email.com',
      secondary_email_address: 'PGemail2@test.com',
      mobile_telephone_number: '07123456789',
      home_telephone_number: '01987 123 123',
      work_telephone_number: '0800 000 1066',
    },
    vehicle_details: {
      vehicle_registration: 'PGreg1',
      vehicle_make_and_model: 'PGmake1 PGmodel1',
    },
    employer_details: {
      employer_name: 'employername4',
      employer_reference: 'OT0000002D',
      employer_email_address: 'emp4@emp.com',
      employer_telephone_number: '01987654321',
      employer_address: {
        address_line_1: 'emp4 addr1 ',
        address_line_2: 'emp4 addr2 ',
        address_line_3: 'emp4 addr3',
        address_line_4: 'emp4 addr4',
        address_line_5: 'emp4 addr5',
        postcode: 'PG98 7ST',
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
