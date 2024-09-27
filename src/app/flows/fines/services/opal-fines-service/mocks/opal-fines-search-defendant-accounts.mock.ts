import { IOpalFinesSearchDefendantAccounts } from '../interfaces/opal-fines-search-defendant-accounts.interface';

export const OPAL_FINES_SEARCH_DEFENDANT_ACCOUNTS_MOCK: IOpalFinesSearchDefendantAccounts = {
  count: 100,
  total_count: 100,
  cursor: 0,
  page_size: 100,
  search_results: [
    {
      account_no: '16000621W  ',
      name: 'SMITH, AAA Mr  ',
      date_of_birth: '2001-08-16',
      address_line_1: 'ASDF  ',
      balance: 0.34,
      court: 'West London  ',
      defendant_account_id: 500000001,
    },
    {
      account_no: '18000027D  ',
      name: 'NORTH, David Mr  ',
      date_of_birth: '1995-08-16',
      address_line_1: '1 St. Kilda Road  ',
      balance: 200.0,
      court: 'West London  ',
      defendant_account_id: 500000002,
    },
    {
      account_no: '16000398C  ',
      name: 'Smith, Joe Mr  ',
      date_of_birth: '1955-08-16',
      address_line_1: '123 The Road  ',
      balance: 1000.0,
      court: 'West London  ',
      defendant_account_id: 500000003,
    },
  ],
};
