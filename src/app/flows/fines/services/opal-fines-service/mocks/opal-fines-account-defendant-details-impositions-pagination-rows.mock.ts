import { IOpalFinesAccountDefendantDetailsImposition } from '../interfaces/opal-fines-account-defendant-details-imposition.interface';

export const OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_PAGINATION_ROWS_MOCK: IOpalFinesAccountDefendantDetailsImposition[] =
  Array.from({ length: 30 }, (_, index) => {
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
  });
