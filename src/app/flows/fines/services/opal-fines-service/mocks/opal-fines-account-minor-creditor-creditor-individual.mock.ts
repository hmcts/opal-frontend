import { IOpalFinesAccountMinorCreditorCreditor } from '../interfaces/opal-fines-account-minor-creditor-creditor.interface';
import { OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_MOCK } from './opal-fines-account-minor-creditor-creditor.mock';

export const OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_INDIVIDUAL_MOCK: IOpalFinesAccountMinorCreditorCreditor = {
  ...structuredClone(OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_MOCK),
  party_details: {
    party_id: 'PARTY-001',
    organisation_flag: false,
    organisation_details: null,
    individual_details: {
      title: 'Mr',
      forenames: 'John',
      surname: 'smith',
      date_of_birth: null,
      age: null,
      national_insurance_number: null,
      individual_aliases: null,
    },
  },
  address: {
    ...OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_MOCK.address,
    postcode: 'ab12 3cd',
  },
  payment: {
    ...OPAL_FINES_ACCOUNT_MINOR_CREDITOR_CREDITOR_MOCK.payment,
    pay_by_bacs: false,
  },
};
