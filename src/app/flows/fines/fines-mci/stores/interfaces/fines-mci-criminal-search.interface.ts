export type FinesMciCriminalSearchTab = 'individuals' | 'companies';

export interface IFinesMciCriminalSearch {
  activeTab: FinesMciCriminalSearchTab;
  searchCriteriaCannotBeCombined: boolean;
  formData: {
    fsa_search_account_number: string | null;
    fsa_search_account_individuals_search_criteria: {
      fsa_search_account_individuals_last_name: string | null;
      fsa_search_account_individuals_first_names: string | null;
      fsa_search_account_individuals_last_name_exact_match: boolean | null;
      fsa_search_account_individuals_first_names_exact_match: boolean | null;
      fsa_search_account_individuals_include_aliases: boolean | null;
    };
    fsa_search_account_companies_search_criteria: {
      fsa_search_account_companies_company_name: string | null;
      fsa_search_account_companies_company_name_exact_match: boolean | null;
      fsa_search_account_companies_include_aliases: boolean | null;
    };
  };
}
