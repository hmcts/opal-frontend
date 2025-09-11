import { IOpalFinesDefendantAccountResponse } from '../interfaces/opal-fines-defendant-account.interface';

const BASE_COMPANY_ACCOUNT = {
  organisation_flag: true,
  business_unit_name: 'Bury St. Edmunds',
  business_unit_id: 'BU001',
  prosecutor_case_reference: 'PCR19274548',
  last_enforcement_action: 'bwtd',
  defendant_title: null,
  national_insurance_number: null,
  parent_guardian_surname: null,
  parent_guardian_first_names: null,
  defendant_first_names: null,
  defendant_surname: null,
  birth_date: null,
};

export const OPAL_FINES_DEFENDANT_ACCOUNT_RESPONSE_COMPANY_MOCK: IOpalFinesDefendantAccountResponse = {
  count: 30,
  defendant_accounts: Array.from({ length: 30 }, (_, i) => {
    const idx = i + 1;
    return {
      ...BASE_COMPANY_ACCOUNT,
      account_number: `23000${idx}BU`,
      defendant_account_id: `${idx}`,
      organisation_name: `COMPANY_${idx}`,
      aliases:
        idx % 2 === 0
          ? [
              {
                alias_number: 1,
                organisation_name: `COMPANY_ALIAS_1_${idx}`,
                alias_surname: null,
                alias_forenames: null,
              },
              {
                alias_number: 2,
                organisation_name: `COMPANY_ALIAS_2_${idx}`,
                alias_surname: null,
                alias_forenames: null,
              },
            ]
          : [],
      address_line_1: `${idx} Business Park`,
      postcode: `RG${idx} 9RT`,
      account_balance: 1500.0 + idx * 25,
    };
  }),
};
