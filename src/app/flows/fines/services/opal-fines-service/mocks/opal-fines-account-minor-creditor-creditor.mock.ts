import { IOpalFinesAccountMinorCreditorCreditor } from '../interfaces/opal-fines-account-minor-creditor-creditor.interface';

export const OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_MOCK: IOpalFinesAccountMinorCreditorCreditor = {
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
    account_id: 123456789,
    title: 'Mr',
    forenames: 'John',
    surname: 'Doe',
  },
  payment: {
    is_bacs: true,
    hold_payment: false,
  },
};
