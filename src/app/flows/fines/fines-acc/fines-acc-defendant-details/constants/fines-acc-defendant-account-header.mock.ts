import { IOpalFinesDefendantAccountHeader } from '../interfaces/fines-acc-defendant-account-header.interface';

export const FINES_ACC_DEFENDANT_ACCOUNT_HEADER_MOCK: IOpalFinesDefendantAccountHeader = {
  id: 56789,
  business_unit_id: 61,
  account_type: 'Fine Account',
  account_number: '123456789',
  prosecutor_case_reference: 'DFG48583045',
  title: 'Mr',
  firstnames: 'John, Peter',
  surname: 'Doe',
  debtor_type: 'Parent/Guardian',
  isYouth: true,
  imposed: 1000,
  arrears: 200,
  paid: 800,
  account_balance: 200,
};
