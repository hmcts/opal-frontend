import { IFinesConSearchResultDefendantAccount } from '../interfaces/fines-con-search-result-defendant-account.interface';

export const FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_FORMATTING_MOCK: IFinesConSearchResultDefendantAccount[] = [
  {
    defendant_account_id: 11,
    account_number: 'ACC001',
    organisation_flag: false,
    aliases: [
      { alias_number: 2, surname: 'Baker', forenames: 'Ben', organisation_name: null },
      { alias_number: 1, surname: 'Adams', forenames: 'Amy', organisation_name: null },
    ],
    address_line_1: '1 Main Street',
    postcode: 'AB1 2CD',
    business_unit_name: null,
    business_unit_id: null,
    prosecutor_case_reference: 'REF-1',
    last_enforcement_action: 'warrant',
    account_balance: 120.5,
    organisation_name: null,
    defendant_title: null,
    defendant_firstnames: 'John James',
    defendant_surname: 'Smith',
    birth_date: '1990-01-03',
    national_insurance_number: 'QQ123456C',
    parent_guardian_surname: null,
    parent_guardian_firstnames: null,
    collection_order: true,
    last_enforcement: 'distress',
    has_paying_parent_guardian: false,
    checks: {
      errors: [{ reference: 'CON.ER.4', message: 'Account has days in default' }],
      warnings: [],
    },
  },
];
