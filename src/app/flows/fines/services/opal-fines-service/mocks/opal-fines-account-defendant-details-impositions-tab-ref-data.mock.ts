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
    const creditorAccountType = index % 2 === 0 ? 'major' : 'minor';
    const imposedAmount = 100 + rowNumber * 12.5;
    const paidAmount = index % 3 === 0 ? 25 : 10;

    return {
      posted_date: `${postedDay}/03/2025`,
      result_id: index % 2 === 0 ? 'FO' : 'COMP',
      creditor_account_id: 770000100000 + rowNumber,
      creditor_account_type: creditorAccountType,
      creditor_name: `${creditorAccountType === 'major' ? 'Major' : 'Minor'} Creditor ${rowNumber}`,
      imposed_amount: imposedAmount,
      paid_amount: paidAmount,
      imposed_date: `${imposedDay}/02/2025`,
      offence_title: `Mock offence title ${rowNumber}`,
      imposing_court_id: index % 2 === 0 ? 100 + rowNumber : null,
      imposing_court_name: index % 2 === 0 ? `Mock Magistrates Court ${rowNumber}` : null,
      imposition_id: `44444444-4444-4444-4444-${String(rowNumber).padStart(12, '0')}`,
    };
  },
);

export const OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_TAB_REF_DATA_MOCK: IOpalFinesAccountDefendantDetailsImpositionsTabRefData =
  {
    version: null,
    impositions: [
      {
        posted_date: '31/01/2025',
        result_id: 'FO',
        creditor_account_id: 770000000001,
        creditor_account_type: 'major',
        creditor_name: 'Central Funds',
        imposed_amount: 200,
        paid_amount: 50,
        imposed_date: '30/01/2025',
        offence_title: 'Speeding - exceed 30mph on restricted road',
        imposing_court_id: 101,
        imposing_court_name: 'West London Magistrates Court',
        imposition_id: '11111111-1111-1111-1111-111111111111',
      },
      {
        posted_date: '01/02/2025',
        result_id: 'COMP',
        creditor_account_id: 660000000001,
        creditor_account_type: 'minor',
        creditor_name: 'Minor Creditor Test Ltd',
        imposed_amount: 75,
        paid_amount: 75,
        imposed_date: '30/01/2025',
        offence_title: 'Failure to comply with court order',
        imposing_court_id: null,
        imposing_court_name: null,
        imposition_id: '22222222-2222-2222-2222-222222222222',
      },
      {
        posted_date: null,
        result_id: 'FCOST',
        creditor_account_id: null,
        creditor_account_type: null,
        creditor_name: null,
        imposed_amount: 30,
        paid_amount: 0,
        imposed_date: null,
        offence_title: null,
        imposing_court_id: null,
        imposing_court_name: null,
        imposition_id: '33333333-3333-3333-3333-333333333333',
      },
      ...ADDITIONAL_IMPOSITIONS_MOCK,
    ],
  };
