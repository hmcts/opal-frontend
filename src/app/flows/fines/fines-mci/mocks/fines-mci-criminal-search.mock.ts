import { IFinesMciCriminalSearch } from '../stores/interfaces/fines-mci-criminal-search.interface';

export const FINES_MCI_CRIMINAL_SEARCH_MOCK: IFinesMciCriminalSearch = {
  activeTab: 'individuals',
  searchCriteriaCannotBeCombined: false,
  formData: {
    fsa_search_account_number: null,
    fsa_search_account_individuals_search_criteria: {
      fsa_search_account_individuals_last_name: 'Example',
      fsa_search_account_individuals_first_names: null,
      fsa_search_account_individuals_last_name_exact_match: false,
      fsa_search_account_individuals_first_names_exact_match: false,
      fsa_search_account_individuals_include_aliases: false,
    },
    fsa_search_account_companies_search_criteria: {
      fsa_search_account_companies_company_name: null,
      fsa_search_account_companies_company_name_exact_match: false,
      fsa_search_account_companies_include_aliases: false,
    },
  },
};
