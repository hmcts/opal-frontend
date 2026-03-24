import { IFinesConSearchResultDefendantAccount } from '@app/flows/fines/fines-con/consolidate-acc/fines-con-search-result/interfaces/fines-con-search-result-defendant-account.interface';
import { FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_COMPANY_FORMATTING_MOCK } from '@app/flows/fines/fines-con/consolidate-acc/fines-con-search-result/mocks/fines-con-search-result-defendant-accounts-company-formatting.mock';
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

export const createCompanyFalseyResult = (): IFinesConSearchResultDefendantAccount => ({
  ...structuredClone(FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_COMPANY_FORMATTING_MOCK[0]),
  defendant_account_id: 22,
  account_number: 'COMP002',
  aliases: null,
  address_line_1: null,
  postcode: null,
  prosecutor_case_reference: null,
  last_enforcement_action: null,
  account_balance: null,
  organisation_name: null,
  collection_order: false,
  last_enforcement: null,
  checks: {
    errors: [],
    warnings: [],
  },
});

export const createCompanyZeroBalanceResult = (): IFinesConSearchResultDefendantAccount => ({
  ...structuredClone(FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_COMPANY_FORMATTING_MOCK[0]),
  defendant_account_id: 23,
  account_number: 'COMP003',
  address_line_1: '3 Zero Balance Way',
  postcode: 'ZB3 0BB',
  prosecutor_case_reference: 'COMP-REF-3',
  account_balance: 0,
  organisation_name: 'Zero Balance Limited',
  collection_order: false,
  last_enforcement: 'warrant',
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

export const createCompanyMaxResultsMock = (): IFinesConSearchResultDefendantAccount[] =>
  Array.from({ length: 100 }, (_, index) => ({
    ...structuredClone(FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_COMPANY_FORMATTING_MOCK[0]),
    defendant_account_id: index + 1,
    account_number: `COMP${String(index + 1).padStart(3, '0')}`,
    aliases: null,
    prosecutor_case_reference: `COMP-REF-${index + 1}`,
    organisation_name: `Company ${index + 1}`,
    account_balance: 500 + index,
    checks: {
      errors: [],
      warnings: [],
    },
  }));

export const createMultipleErrorsAndWarningsResult = (): IFinesConSearchResultDefendantAccount => ({
  ...structuredClone(FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_FORMATTING_MOCK[0]),
  defendant_account_id: 15,
  account_number: 'ACC005',
  prosecutor_case_reference: 'REF-5',
  defendant_firstnames: 'Erin',
  defendant_surname: 'Example',
  checks: {
    errors: [
      { reference: 'CON.ER.1', message: 'Account status is CS' },
      { reference: 'CON.ER.2', message: 'Account is blocked for consolidation' },
    ],
    warnings: [
      { reference: 'CON.WN.1', message: 'Account has uncleared cheque payments' },
      { reference: 'CON.WN.2', message: 'Account has linked cases' },
    ],
  },
});

export const createMultipleWarningsResult = (): IFinesConSearchResultDefendantAccount => ({
  ...structuredClone(FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_FORMATTING_MOCK[0]),
  defendant_account_id: 16,
  account_number: 'ACC006',
  prosecutor_case_reference: 'REF-6',
  defendant_firstnames: 'Wendy',
  defendant_surname: 'Warning',
  checks: {
    errors: [],
    warnings: [
      { reference: 'CON.WN.1', message: 'Account has uncleared cheque payments' },
      { reference: 'CON.WN.2', message: 'Account has linked cases' },
    ],
  },
});

export const createCompanyMultipleErrorsAndWarningsResult = (): IFinesConSearchResultDefendantAccount => ({
  ...structuredClone(FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_COMPANY_FORMATTING_MOCK[0]),
  defendant_account_id: 25,
  account_number: 'COMP005',
  prosecutor_case_reference: 'COMP-REF-5',
  organisation_name: 'Errors & Warnings Ltd',
  checks: {
    errors: [
      { reference: 'CON.ER.1', message: 'Account status is CS' },
      { reference: 'CON.ER.2', message: 'Account is blocked for consolidation' },
    ],
    warnings: [
      { reference: 'CON.WN.1', message: 'Account has uncleared cheque payments' },
      { reference: 'CON.WN.2', message: 'Account has linked cases' },
    ],
  },
});

export const createCompanyMultipleWarningsResult = (): IFinesConSearchResultDefendantAccount => ({
  ...structuredClone(FINES_CON_SEARCH_RESULT_DEFENDANT_ACCOUNTS_COMPANY_FORMATTING_MOCK[0]),
  defendant_account_id: 26,
  account_number: 'COMP006',
  prosecutor_case_reference: 'COMP-REF-6',
  organisation_name: 'Warnings Only Ltd',
  checks: {
    errors: [],
    warnings: [
      { reference: 'CON.WN.1', message: 'Account has uncleared cheque payments' },
      { reference: 'CON.WN.2', message: 'Account has linked cases' },
    ],
  },
});
