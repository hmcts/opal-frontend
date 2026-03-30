import { IFinesConSearchResultDefendantAccount } from '../interfaces/fines-con-search-result-defendant-account.interface';

export const FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_COMPANY_FORMATTING_MOCK: IFinesConSearchResultDefendantAccount[] =
  [
    {
      defendant_account_id: 21,
      account_number: 'COMP001',
      organisation_flag: true,
      aliases: [
        { alias_number: 2, organisation_name: 'Bravo Ltd', surname: null, forenames: null },
        { alias_number: 1, organisation_name: 'Alpha Ltd', surname: null, forenames: null },
      ],
      address_line_1: '21 Company Street',
      postcode: 'CO1 2MP',
      business_unit_name: null,
      business_unit_id: null,
      prosecutor_case_reference: 'COMP-REF-1',
      last_enforcement_action: 'warrant',
      account_balance: 520.5,
      organisation_name: 'Acme Corporation',
      defendant_title: null,
      defendant_firstnames: null,
      defendant_surname: null,
      birth_date: null,
      national_insurance_number: null,
      parent_guardian_surname: null,
      parent_guardian_firstnames: null,
      collection_order: true,
      last_enforcement: 'distress',
      has_paying_parent_guardian: false,
      checks: {
        errors: [],
        warnings: [],
      },
    },
  ];
