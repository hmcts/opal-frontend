import { IOpalFinesSearchOffencesData } from '@services/fines/opal-fines-service/interfaces/opal-fines-search-offences.interface';

// Mock for no results scenario
export const NO_SEARCH_RESULTS_MOCK: IOpalFinesSearchOffencesData = {
  count: 0,
  searchData: [],
};

// Mock for specific test cases with different scenarios
export const TEST_CASES_MOCK: IOpalFinesSearchOffencesData = {
  count: 2,
  searchData: [
    {
      offence_id: 1,
      cjs_code: 'AK123456',
      offence_title: 'Test Active Offence',
      offence_title_cy: 'Test Active Offence in Welsh',
      offence_oas: 'Criminal Justice Act 2003 s.123',
      offence_oas_cy: 'Criminal Justice Act 2003 s.123 in Welsh',
      date_used_from: '2020-01-01T00:00:00',
      date_used_to: null, // Active offence
    },
    {
      offence_id: 2,
      cjs_code: 'BK789012',
      offence_title: 'Test Expired Offence',
      offence_title_cy: 'Test Expired Offence in Welsh',
      offence_oas: 'Criminal Justice Act 2003 s.456',
      offence_oas_cy: 'Criminal Justice Act 2003 s.456 in Welsh',
      date_used_from: '2020-01-01T00:00:00',
      date_used_to: '2024-12-31T00:00:00', // Expired offence
    },
  ],
};

// Mock for full results (pagination testing)
export const FULL_SEARCH_RESULTS_MOCK: IOpalFinesSearchOffencesData = {
  count: 100,
  searchData: Array(100)
    .fill(null)
    .map((_, index) => ({
      offence_id: index + 1,
      cjs_code: `CJS${String(index + 1).padStart(3, '0')}`,
      offence_title: `Offence Title ${index + 1}`,
      offence_title_cy: `Offence Title ${index + 1} in Welsh`,
      offence_oas: `Section ${Math.floor(index / 10) + 1}.${(index % 10) + 1}`,
      offence_oas_cy: `Section ${Math.floor(index / 10) + 1}.${(index % 10) + 1} in Welsh`,
      date_used_from: '2024-01-01T00:00:00',
      date_used_to: index % 5 === 0 ? null : '2025-12-31T00:00:00',
    })),
};
