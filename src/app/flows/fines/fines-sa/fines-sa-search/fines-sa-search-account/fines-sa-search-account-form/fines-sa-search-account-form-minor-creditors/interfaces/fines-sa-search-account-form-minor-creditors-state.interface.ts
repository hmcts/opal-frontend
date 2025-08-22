export interface IFinesSaSearchAccountFormMinorCreditorsState {
  fsa_search_account_minor_creditors_minor_creditor_type: string | null;
  fsa_search_account_minor_creditors_individual: {
    fsa_search_account_minor_creditors_last_name: string | null;
    fsa_search_account_minor_creditors_last_name_exact_match: boolean | null;
    fsa_search_account_minor_creditors_first_names: string | null;
    fsa_search_account_minor_creditors_first_names_exact_match: boolean | null;
    fsa_search_account_minor_creditors_individual_address_line_1: string | null;
    fsa_search_account_minor_creditors_individual_post_code: string | null;
  };
  fsa_search_account_minor_creditors_company: {
    fsa_search_account_minor_creditors_company_name: string | null;
    fsa_search_account_minor_creditors_company_name_exact_match: boolean | null;
    fsa_search_account_minor_creditors_company_address_line_1: string | null;
    fsa_search_account_minor_creditors_company_post_code: string | null;
  };
}
