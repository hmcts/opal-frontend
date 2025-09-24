// Central mock file that aggregates all account types for search results
import * as IndividualsMocks from './search_results_individuals_mock';
import * as CompaniesMocks from './search_results_companies_mock';
import * as MinorCreditorsMocks from './search_results_minor_creditors_mock';

// Re-export all individual mocks
export const INDIVIDUALS_MOCKS = IndividualsMocks;
export const COMPANIES_MOCKS = CompaniesMocks;
export const MINOR_CREDITORS_MOCKS = MinorCreditorsMocks;

// Unified mock structure for all account types
export const UNIFIED_SEARCH_RESULTS_MOCK = {
  // Empty results scenarios
  EMPTY_RESULTS: {
    individuals: IndividualsMocks.EMPTY_SEARCH_RESULTS_MOCK,
    companies: CompaniesMocks.EMPTY_SEARCH_RESULTS_MOCK,
    minorCreditors: MinorCreditorsMocks.EMPTY_SEARCH_RESULTS_MOCK,
  },

  // Results with data scenarios
  WITH_DATA: {
    individuals: IndividualsMocks.SEARCH_RESULTS_WITH_DATA_MOCK,
    companies: CompaniesMocks.SEARCH_RESULTS_WITH_DATA_MOCK,
    minorCreditors: MinorCreditorsMocks.INDIVIDUAL_SEARCH_RESULTS_MOCK,
  },

  // Large results scenarios (more than 100 for minor creditor and 99 for individual and company)
  LARGE_RESULTS: {
    individuals: IndividualsMocks.SEARCH_RESULTS_MOCK,
    companies: CompaniesMocks.SEARCH_RESULTS_MOCK,
    minorCreditors: MinorCreditorsMocks.LARGE_SEARCH_RESULTS_MOCK,
  },

  //Partial results scenario (only individuals and companies)
  PARTIAL_RESULTS: {
    individuals: IndividualsMocks.SEARCH_RESULTS_WITH_DATA_MOCK,
    companies: CompaniesMocks.SEARCH_RESULTS_WITH_DATA_MOCK,
    minorCreditors: MinorCreditorsMocks.EMPTY_SEARCH_RESULTS_MOCK,
  },

  //Company and minor creditors results scenario
  COMPANY_RESULTS_ONLY: {
    companies: CompaniesMocks.SEARCH_RESULTS_WITH_DATA_MOCK,
    individuals: IndividualsMocks.EMPTY_SEARCH_RESULTS_MOCK,
    minorCreditors: MinorCreditorsMocks.INDIVIDUAL_SEARCH_RESULTS_MOCK,
  },

  // Individuals only results scenario
  INDIVIDUALS_ONLY_RESULTS: {
    individuals: IndividualsMocks.SEARCH_RESULTS_WITH_DATA_MOCK,
    companies: CompaniesMocks.EMPTY_SEARCH_RESULTS_MOCK,
    minorCreditors: MinorCreditorsMocks.EMPTY_SEARCH_RESULTS_MOCK,
  },

  //Minor creditor only results scenario
  MINOR_CREDITOR_ONLY_RESULTS: {
    individuals: IndividualsMocks.EMPTY_SEARCH_RESULTS_MOCK,
    companies: CompaniesMocks.EMPTY_SEARCH_RESULTS_MOCK,
    minorCreditors: MinorCreditorsMocks.INDIVIDUAL_SEARCH_RESULTS_MOCK,
  },
};

// Helper function to get all account types for a specific scenario
export const getAllAccountTypes = (scenario: keyof typeof UNIFIED_SEARCH_RESULTS_MOCK) => {
  return UNIFIED_SEARCH_RESULTS_MOCK[scenario];
};

// Helper function to get specific account type for a scenario
export const getAccountTypeData = (
  scenario: keyof typeof UNIFIED_SEARCH_RESULTS_MOCK,
  accountType: 'individuals' | 'companies' | 'minorCreditors',
) => {
  return UNIFIED_SEARCH_RESULTS_MOCK[scenario][accountType];
};
