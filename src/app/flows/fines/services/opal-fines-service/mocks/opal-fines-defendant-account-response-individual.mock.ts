import { IOpalFinesDefendantAccountResponse } from '../interfaces/opal-fines-defendant-account.interface';

const BASE_ACCOUNT = {
  organisation_flag: false,
  business_unit_name: 'Bury St. Edmunds',
  business_unit_id: 'BU001',
  prosecutor_case_reference: 'PCR19274548',
  last_enforcement_action: 'bwtd',
  organisation_name: null,
  defendant_title: 'Mr',
  national_insurance_number: 'JK567890C',
  parent_guardian_surname: 'DOE',
  parent_guardian_firstnames: 'Jane',
};

export const OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK: IOpalFinesDefendantAccountResponse = {
  count: 30,
  defendant_accounts: Array.from({ length: 30 }, (_, i) => {
    const idx = i + 1;
    return {
      ...BASE_ACCOUNT,
      account_number: `13000${idx}BU`,
      defendant_account_id: Number(`${idx}`),
      defendant_surname: `SMITH_${idx}`,
      defendant_firstnames: `John Michael_${idx}`,
      birth_date: `1985-06-${String(idx).padStart(2, '0')}`,
      aliases:
        idx % 2 === 0
          ? [
              {
                alias_number: 1,
                organisation_name: null,
                surname: `SMITH_${idx}`,
                forenames: `John Michael_${idx}`,
              },
              {
                alias_number: 2,
                organisation_name: null,
                surname: `SMYTHE_${idx}`,
                forenames: `Jon M._${idx}`,
              },
            ]
          : [],
      address_line_1: `${idx} High Street`,
      postcode: `RG${idx} 9RT`,
      account_balance: 704.0 + idx * 10,
    };
  }),
};

export const OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK_101: IOpalFinesDefendantAccountResponse = {
  count: 101,
  defendant_accounts: Array.from({ length: 101 }, (_, i) => {
    const idx = i + 1;
    return {
      ...BASE_ACCOUNT,
      account_number: `13000${idx}BU`,
      defendant_account_id: Number(`${idx}`),
      defendant_surname: `SMITH_${idx}`,
      defendant_firstnames: `John Michael_${idx}`,
      birth_date: `1985-06-${String(idx).padStart(2, '0')}`,
      aliases:
        idx % 2 === 0
          ? [
              {
                alias_number: 1,
                organisation_name: null,
                surname: `SMITH_${idx}`,
                forenames: `John Michael_${idx}`,
              },
              {
                alias_number: 2,
                organisation_name: null,
                surname: `SMYTHE_${idx}`,
                forenames: `Jon M._${idx}`,
              },
            ]
          : [],
      address_line_1: `${idx} High Street`,
      postcode: `RG${idx} 9RT`,
      account_balance: 704.0 + idx * 10,
    };
  }),
};
