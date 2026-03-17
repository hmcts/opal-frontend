import { IFinesConSearchResultDefendantAccount } from '../interfaces/fines-con-search-result-defendant-account.interface';

export const FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_WITH_CHECKS_MOCK: IFinesConSearchResultDefendantAccount[] = [
  {
    defendant_account_id: 99000000000020,
    account_number: 'CONSOLC001',
    organisation_flag: false,
    aliases: null,
    address_line_1: '20 Consolidation Street',
    postcode: 'CS2 0BB',
    business_unit_name: 'Camberwell Green',
    business_unit_id: '77',
    prosecutor_case_reference: 'CONSOL-SEARCH-CHILD-1',
    last_enforcement_action: 'CONSOL',
    account_balance: 0,
    organisation_name: null,
    defendant_title: 'Mr',
    defendant_firstnames: 'BEN',
    defendant_surname: 'CONSOLCHILDONE',
    birth_date: '1990-02-20',
    national_insurance_number: null,
    parent_guardian_surname: null,
    parent_guardian_firstnames: null,
    checks: {
      errors: [{ reference: 'CON.ER.1', message: 'Account status is `CS`' }],
      warnings: [{ reference: 'CON.WN.2', message: 'Account has uncleared cheque payments' }],
    },
  },
];
