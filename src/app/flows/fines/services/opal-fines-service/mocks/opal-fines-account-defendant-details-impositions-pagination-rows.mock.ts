import { OPAL_FINES_CREDITOR_ACCOUNT_TYPES } from '../constants/opal-fines-creditor-account-types.constant';
import { IOpalFinesAccountDefendantDetailsImposition } from '../interfaces/opal-fines-account-defendant-details-imposition.interface';

export const OPAL_FINES_ACCOUNT_DEFENDANT_DETAILS_IMPOSITIONS_PAGINATION_ROWS_MOCK: IOpalFinesAccountDefendantDetailsImposition[] =
  Array.from({ length: 30 }, (_, index) => {
    const rowNumber = index + 1;
    const postedDay = String(rowNumber).padStart(2, '0');
    const imposedDay = String((index % 28) + 1).padStart(2, '0');
    const creditorAccountType =
      index % 2 === 0 ? OPAL_FINES_CREDITOR_ACCOUNT_TYPES.major : OPAL_FINES_CREDITOR_ACCOUNT_TYPES.minor;
    const imposedAmount = 100 + rowNumber * 12.5;
    const paidAmount = index % 3 === 0 ? 25 : 10;
    const creditorTypeDisplayName =
      creditorAccountType === OPAL_FINES_CREDITOR_ACCOUNT_TYPES.major ? 'Major Creditor' : 'Minor Creditor';

    return {
      date_added: `2025-03-${postedDay}`,
      imposition: {
        result_id: index % 2 === 0 ? 'FO' : 'COMP',
        result_title: index % 2 === 0 ? 'Fine only' : 'Compensation',
      },
      creditor: {
        creditor_account_id: 770000100000 + rowNumber,
        creditor_account_type_reference: {
          creditor_account_type: creditorAccountType,
          creditor_account_display_name: creditorTypeDisplayName,
        },
        major_creditor_name:
          creditorAccountType === OPAL_FINES_CREDITOR_ACCOUNT_TYPES.major
            ? `${creditorTypeDisplayName} ${rowNumber}`
            : null,
        minor_creditor_organisation_flag: creditorAccountType === OPAL_FINES_CREDITOR_ACCOUNT_TYPES.minor ? true : null,
        individual_name: null,
        company_name:
          creditorAccountType === OPAL_FINES_CREDITOR_ACCOUNT_TYPES.minor
            ? { organisation_name: `${creditorTypeDisplayName} ${rowNumber}` }
            : null,
      },
      imposed_amount: imposedAmount,
      paid_amount: paidAmount,
      balance: Number((imposedAmount - paidAmount).toFixed(2)),
      date_imposed: `2025-02-${imposedDay}`,
      offence: {
        offence_id: 33369 + rowNumber,
        cjs_code: `MOCK${rowNumber}`,
        offence_title: `Mock offence title ${rowNumber}`,
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
