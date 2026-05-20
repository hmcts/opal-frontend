import {
  IOpalFinesAccountDefendantDetailsImposition,
  IOpalFinesAccountDefendantDetailsImpositionsTabRefData,
} from '../interfaces/opal-fines-account-defendant-details-impositions-tab-ref-data.interface';

const ADDITIONAL_IMPOSITIONS_MOCK: IOpalFinesAccountDefendantDetailsImposition[] = Array.from(
  { length: 30 },
  (_, index) => {
    const rowNumber = index + 1;
    const postedDay = String(rowNumber).padStart(2, '0');
    const imposedDay = String((index % 28) + 1).padStart(2, '0');
    const creditorAccountType = index % 2 === 0 ? 'MJ' : 'MN';
    const imposedAmount = 100 + rowNumber * 12.5;
    const paidAmount = index % 3 === 0 ? 25 : 10;
    const creditorTypeDisplayName = creditorAccountType === 'MJ' ? 'Major Creditor' : 'Minor Creditor';

    return {
      date_added: `2025-03-${postedDay}`,
      imposition: {
        result_id: index % 2 === 0 ? 'FO' : 'COMP',
        result_title: index % 2 === 0 ? 'Fine only' : 'Compensation',
      },
      creditor: {
        creditor_account_id: 770000100000 + rowNumber,
        account_type: creditorAccountType,
        display_name: creditorTypeDisplayName,
        major_creditor_id: creditorAccountType === 'MJ' ? 880000100000 + rowNumber : null,
        minor_creditor_party_id: creditorAccountType === 'MN' ? 990000100000 + rowNumber : null,
        name: `${creditorTypeDisplayName} ${rowNumber}`,
      },
      imposed_amount: imposedAmount,
      paid_amount: paidAmount,
      balance: Number((imposedAmount - paidAmount).toFixed(2)),
      date_imposed: `2025-02-${imposedDay}`,
      offence: {
        id: 33369 + rowNumber,
        code: `MOCK${rowNumber}`,
        title: `Mock offence title ${rowNumber}`,
      },
      imposed_by:
        index % 2 === 0
          ? {
              court_id: 100 + rowNumber,
              court_code: 200 + rowNumber,
              court_name: `Mock Magistrates Court ${rowNumber}`,
            }
          : null,
      imposition_id: 444444440000 + rowNumber,
    };
  },
);

export const OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK: IOpalFinesAccountDefendantDetailsImpositionsTabRefData =
  {
    version: null,
    impositions: [
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
      ...ADDITIONAL_IMPOSITIONS_MOCK,
    ],
  };
