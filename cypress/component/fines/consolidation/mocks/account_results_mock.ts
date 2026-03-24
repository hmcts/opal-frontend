import { IFinesConSearchResultDefendantAccount } from '@app/flows/fines/fines-con/consolidate-acc/fines-con-search-result/interfaces/fines-con-search-result-defendant-account.interface';
import { FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_FORMATTING_MOCK } from '@app/flows/fines/fines-con/consolidate-acc/fines-con-search-result/mocks/fines-con-search-result-defendant-accounts-formatting.mock';

export const createFalseyResult = (): IFinesConSearchResultDefendantAccount => ({
  ...structuredClone(FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_FORMATTING_MOCK[0]),
  defendant_account_id: 12,
  account_number: 'ACC002',
  aliases: null,
  address_line_1: null,
  postcode: null,
  prosecutor_case_reference: null,
  last_enforcement_action: null,
  account_balance: null,
  defendant_firstnames: null,
  defendant_surname: null,
  birth_date: null,
  national_insurance_number: null,
  collection_order: false,
  last_enforcement: null,
  has_paying_parent_guardian: false,
  checks: {
    errors: [],
    warnings: [],
  },
});

export const createZeroBalanceResult = (): IFinesConSearchResultDefendantAccount => ({
  ...structuredClone(FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_FORMATTING_MOCK[0]),
  defendant_account_id: 13,
  account_number: 'ACC003',
  address_line_1: '3 Zero Balance Street',
  postcode: 'ZB3 0BB',
  prosecutor_case_reference: 'REF-3',
  account_balance: 0,
  defendant_firstnames: 'Zoe',
  defendant_surname: 'Zero',
  birth_date: '1995-05-05',
  national_insurance_number: 'AB123456C',
  collection_order: false,
  last_enforcement: 'warrant',
  has_paying_parent_guardian: false,
  checks: {
    errors: [],
    warnings: [],
  },
});

export const createMaxResultsMock = (): IFinesConSearchResultDefendantAccount[] =>
  Array.from({ length: 100 }, (_, index) => ({
    ...structuredClone(FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_FORMATTING_MOCK[0]),
    defendant_account_id: index + 1,
    account_number: `ACC${String(index + 1).padStart(3, '0')}`,
    aliases: null,
    prosecutor_case_reference: `REF-${index + 1}`,
    defendant_firstnames: `First${index + 1}`,
    defendant_surname: `Surname${index + 1}`,
    birth_date: '1990-01-03',
    account_balance: 50 + index,
    has_paying_parent_guardian: false,
    checks: {
      errors: [],
      warnings: [],
    },
  }));
