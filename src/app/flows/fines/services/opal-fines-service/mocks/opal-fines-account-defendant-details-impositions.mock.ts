import { IOpalFinesAccountDefendantDetailsImposition } from '../interfaces/opal-fines-account-defendant-details-imposition.interface';
import { IOpalFinesAccountDefendantDetailsImpositionsTabRefData } from '../interfaces/opal-fines-account-defendant-details-impositions-tab-ref-data.interface';
import { OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_PAGINATION_ROWS_MOCK } from './opal-fines-account-defendant-details-impositions-pagination-rows.mock';

export const OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_MOCK: IOpalFinesAccountDefendantDetailsImposition[] = [
  {
    date_added: '2025-01-31',
    imposition: {
      result_id: 'FO',
      result_title: 'Fine only',
    },
    creditor: {
      creditor_account_id: 770000000001,
      account_type: 'MJ',
      display_name: 'Major Creditor',
      major_creditor_id: 880000000001,
      minor_creditor_party_id: null,
      name: 'Central Funds',
    },
    imposed_amount: 200,
    paid_amount: 50,
    balance: 150,
    date_imposed: '2025-01-30',
    offence: {
      id: 33369,
      code: 'HY35014',
      title: 'Speeding - exceed 30mph on restricted road',
    },
    imposed_by: {
      court_id: 101,
      court_code: 102,
      court_name: 'West London Magistrates Court',
    },
    imposition_id: 111111111111,
  },
  {
    date_added: '2025-02-01',
    imposition: {
      result_id: 'COMP',
      result_title: 'Compensation',
    },
    creditor: {
      creditor_account_id: 660000000001,
      account_type: 'MN',
      display_name: 'Minor Creditor',
      major_creditor_id: null,
      minor_creditor_party_id: 990000000001,
      name: 'Minor Creditor Test Ltd',
    },
    imposed_amount: 75,
    paid_amount: 75,
    balance: 0,
    date_imposed: '2025-01-30',
    offence: {
      id: 33370,
      code: 'HY35015',
      title: 'Failure to comply with court order',
    },
    imposed_by: null,
    imposition_id: 222222222222,
  },
  {
    date_added: null,
    imposition: {
      result_id: 'FCOST',
      result_title: 'Costs',
    },
    creditor: {
      creditor_account_id: 770000000003,
      account_type: 'CF',
      display_name: 'Central Fund',
      major_creditor_id: null,
      minor_creditor_party_id: null,
      name: 'Central Fund',
    },
    imposed_amount: 30,
    paid_amount: 0,
    balance: 30,
    date_imposed: null,
    offence: {
      id: null,
      code: null,
      title: 'Offence title not provided',
    },
    imposed_by: null,
    imposition_id: 333333333333,
  },
  ...OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_PAGINATION_ROWS_MOCK,
];

export const OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK: IOpalFinesAccountDefendantDetailsImpositionsTabRefData =
  {
    version: null,
    impositions: OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_MOCK,
  };
