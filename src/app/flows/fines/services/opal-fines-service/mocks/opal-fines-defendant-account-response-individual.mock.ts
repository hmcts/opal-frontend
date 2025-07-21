import { IOpalFinesDefendantAccountResponse } from '../interfaces/opal-fines-defendant-account.interface';

const BASE_ACCOUNT = {
  organisation_flag: false,
  aliases: [
    {
      alias_number: 1,
      organisation_name: null,
      alias_surname: 'SMITH',
      alias_forenames: 'John Michael',
    },
    {
      alias_number: 2,
      organisation_name: null,
      alias_surname: 'SMYTHE',
      alias_forenames: 'Jon M.',
    },
  ],
  address_line_1: '123 High Street',
  postcode: 'AB1 2CD',
  business_unit_name: 'Central Fines Unit',
  business_unit_id: 'BU001',
  prosecutor_case_reference: 'PCR-456789',
  last_enforcement_action: 'ARREST WARRANT',
  account_balance: 1250.75,
  organisation_name: null,
  defendant_title: 'Mr',
  national_insurance_number: 'QQ123456C',
  parent_guardian_surname: 'DOE',
  parent_guardian_first_names: 'Jane',
};

export const OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK: IOpalFinesDefendantAccountResponse = {
  count: 30,
  defendant_accounts: Array.from({ length: 30 }, (_, i) => {
    const idx = i + 1;
    return {
      ...BASE_ACCOUNT,
      defendant_account_id: `DEF${String(idx).padStart(6, '0')}`,
      account_number: `ACC${String(idx).padStart(6, '0')}`,
      defendant_surname: `SMITH_${idx}`,
      defendant_first_names: `John Michael_${idx}`,
      birth_date: `1985-06-${String(idx).padStart(2, '0')}`,
      aliases: [
        {
          alias_number: 1,
          organisation_name: null,
          alias_surname: `SMITH_${idx}`,
          alias_forenames: `John Michael_${idx}`,
        },
        {
          alias_number: 2,
          organisation_name: null,
          alias_surname: `SMYTHE_${idx}`,
          alias_forenames: `Jon M._${idx}`,
        },
      ],
    };
  }),
};

export const OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_INDIVIDUAL_MOCK_101: IOpalFinesDefendantAccountResponse = {
  count: 101,
  defendant_accounts: Array.from({ length: 101 }, (_, i) => {
    const idx = i + 1;
    return {
      ...BASE_ACCOUNT,
      defendant_account_id: `DEF${String(idx).padStart(6, '0')}`,
      account_number: `ACC${String(idx).padStart(6, '0')}`,
      defendant_surname: `SMITH_${idx}`,
      defendant_first_names: `John Michael_${idx}`,
      birth_date: `1985-06-${String(idx).padStart(2, '0')}`,
      aliases: [
        {
          alias_number: 1,
          organisation_name: null,
          alias_surname: `SMITH_${idx}`,
          alias_forenames: `John Michael_${idx}`,
        },
        {
          alias_number: 2,
          organisation_name: null,
          alias_surname: `SMYTHE_${idx}`,
          alias_forenames: `Jon M._${idx}`,
        },
      ],
    };
  }),
};
