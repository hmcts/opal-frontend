import { IOpalFinesAccountMinorCreditorAtAGlance } from '../interfaces/opal-fines-account-minor-creditor-at-a-glance.interface';

export const OPAL_FINES_ACCOUNT_MINOR_CREDITOR_AT_A_GLANCE_WITH_DEFENDANT_MOCK: IOpalFinesAccountMinorCreditorAtAGlance =
  {
    version: null,
    creditor_account_id: 'ACC-123456',
    party: {
      party_id: 'PARTY-001',
      organisation_flag: true,
      organisation_details: {
        organisation_name: 'Test Organisation',
        organisation_aliases: null,
      },
      individual_details: null,
    },
    address: {
      address_line_1: '123 Main Street',
      address_line_2: 'Apt 4',
      address_line_3: null,
      address_line_4: null,
      address_line_5: null,
      postcode: 'AB12 3CD',
    },
    defendant: {
      account_number: 'ACC-654321',
      id: 123456789,
      name: 'John Doe',
      hearing_date: '07/07/2026',
    },
    payment: {
      is_bacs: true,
      hold_payment: false,
    },
  };
