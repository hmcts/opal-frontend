import { IOpalFinesDefendantAccountResponse } from '../../../../../src/app/flows/fines/services/opal-fines-service/interfaces/opal-fines-defendant-account.interface';

// Mock for empty search results (no results scenario)
export const EMPTY_SEARCH_RESULTS_MOCK: IOpalFinesDefendantAccountResponse = {
  count: 0,
  defendant_accounts: [],
};

// Mock for search results with data
export const SEARCH_RESULTS_WITH_DATA_MOCK: IOpalFinesDefendantAccountResponse = {
  count: 2,
  defendant_accounts: [
    {
      defendant_account_id: '1',
      account_number: '13001BU',
      organisation_flag: false,
      aliases: [
        {
          alias_number: 1,
          organisation_name: null,
          alias_surname: 'SMITH',
          alias_forenames: 'John Michael',
        },
      ],
      address_line_1: '1 High Street',
      postcode: 'RG1 9RT',
      business_unit_name: 'Test Business Unit',
      business_unit_id: 'BU001',
      prosecutor_case_reference: 'PCR19274548',
      last_enforcement_action: 'bwtd',
      account_balance: 714.0,
      organisation_name: null,
      defendant_title: 'Mr',
      defendant_first_names: 'John Michael',
      defendant_surname: 'SMITH',
      birth_date: '1985-06-01',
      national_insurance_number: 'JK567890C',
      parent_guardian_surname: 'DOE',
      parent_guardian_first_names: 'Jane',
    },
    {
      defendant_account_id: '2',
      account_number: '13002BU',
      organisation_flag: false,
      aliases: null,
      address_line_1: '2 High Street',
      postcode: 'RG2 9RT',
      business_unit_name: 'Test Business Unit',
      business_unit_id: 'BU001',
      prosecutor_case_reference: 'PCR19274549',
      last_enforcement_action: 'warrant',
      account_balance: 524.0,
      organisation_name: null,
      defendant_title: 'Ms',
      defendant_first_names: 'Jane',
      defendant_surname: 'DOE',
      birth_date: '1990-03-15',
      national_insurance_number: 'AB123456C',
      parent_guardian_surname: null,
      parent_guardian_first_names: null,
    },
  ],
};

// Mock for exactly 100 search results
export const PAGINATION_SEARCH_RESULTS_MOCK: IOpalFinesDefendantAccountResponse = {
  count: 100,
  defendant_accounts: Array.from({ length: 100 }, (_, index) => ({
    defendant_account_id: (index + 1).toString(),
    account_number: `1300${String(index + 1).padStart(3, '0')}BU`,
    organisation_flag: false,
    aliases: null,
    address_line_1: `${index + 1} Test Street`,
    postcode: `RG${index + 1} 9RT`,
    business_unit_name: 'Test Business Unit',
    business_unit_id: 'BU001',
    prosecutor_case_reference: `PCR1927${String(4548 + index)}`,
    last_enforcement_action: index % 2 === 0 ? 'bwtd' : 'warrant',
    account_balance: 500.0 + index * 10,
    organisation_name: null,
    defendant_title: index % 2 === 0 ? 'Mr' : 'Ms',
    defendant_first_names: index % 2 === 0 ? 'John' : 'Jane',
    defendant_surname: `SMITH${index + 1}`,
    birth_date: `198${Math.floor(index / 10)}-0${(index % 9) + 1}-01`,
    national_insurance_number: `AB${String(123456 + index)}C`,
    parent_guardian_surname: index % 3 === 0 ? 'DOE' : null,
    parent_guardian_first_names: index % 3 === 0 ? 'Parent' : null,
  })),
};

// Mock for more than 100 search results (AC3 scenario)
export const LARGE_SEARCH_RESULTS_MOCK: IOpalFinesDefendantAccountResponse = {
  count: 101,
  defendant_accounts: Array.from({ length: 101 }, (_, index) => ({
    defendant_account_id: (index + 1).toString(),
    account_number: `1300${String(index + 1).padStart(3, '0')}BU`,
    organisation_flag: false,
    aliases: null,
    address_line_1: `${index + 1} Test Street`,
    postcode: `RG${index + 1} 9RT`,
    business_unit_name: 'Test Business Unit',
    business_unit_id: 'BU001',
    prosecutor_case_reference: `PCR1927${String(4548 + index)}`,
    last_enforcement_action: index % 2 === 0 ? 'bwtd' : 'warrant',
    account_balance: 500.0 + index * 10,
    organisation_name: null,
    defendant_title: index % 2 === 0 ? 'Mr' : 'Ms',
    defendant_first_names: index % 2 === 0 ? 'John' : 'Jane',
    defendant_surname: `SMITH${index + 1}`,
    birth_date: `198${Math.floor(index / 10)}-0${(index % 9) + 1}-01`,
    national_insurance_number: `AB${String(123456 + index)}C`,
    parent_guardian_surname: index % 3 === 0 ? 'DOE' : null,
    parent_guardian_first_names: index % 3 === 0 ? 'Parent' : null,
  })),
};
