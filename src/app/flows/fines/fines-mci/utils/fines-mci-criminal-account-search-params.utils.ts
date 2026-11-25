import { IOpalFinesDefendantAccountSearchParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account-search-params.interface';
import { OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS } from '@services/fines/opal-fines-service/constants/opal-fines-defendant-account-search-params-defaults.constant';
import { OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFENDANT_DEFAULTS } from '@services/fines/opal-fines-service/constants/opal-fines-defendant-account-search-params-defendant-defaults.constant';
import { OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_REFERENCE_DEFAULTS } from '@services/fines/opal-fines-service/constants/opal-fines-defendant-account-search-params-reference-defaults.constant';
import { IFinesMciCriminalSearch } from '../stores/interfaces/fines-mci-criminal-search.interface';

/**
 * Builds the API payload for the selected business unit and stored search criteria.
 * Account-number searches include inactive accounts; name searches include active accounts only.
 *
 * @param search The submitted form data and selected advanced-search tab.
 * @param businessUnitId The business unit selected for the manual cash input journey.
 * @param isCompany The party type to query, defaulting to the selected tab for name searches.
 * Account-number searches supply each party type explicitly to search across both.
 * @returns The defendant account search request parameters.
 */
export const buildFinesMciCriminalAccountSearchParams = (
  search: IFinesMciCriminalSearch,
  businessUnitId: number,
  isCompany = search.activeTab === 'companies',
): IOpalFinesDefendantAccountSearchParams => {
  const formValue = search.formData;
  const baseSearchParams = {
    ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS,
    business_unit_ids: [businessUnitId],
  };

  if (formValue.fsa_search_account_number) {
    return {
      ...baseSearchParams,
      reference_number: {
        ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_REFERENCE_DEFAULTS,
        account_number: formValue.fsa_search_account_number,
        organisation: isCompany,
      },
      active_accounts_only: false,
    };
  }

  if (isCompany) {
    const companyCriteria = formValue.fsa_search_account_companies_search_criteria;
    return {
      ...baseSearchParams,
      defendant: {
        ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFENDANT_DEFAULTS,
        organisation_name: companyCriteria?.fsa_search_account_companies_company_name,
        exact_match_organisation_name: companyCriteria?.fsa_search_account_companies_company_name_exact_match ?? false,
        include_aliases: companyCriteria?.fsa_search_account_companies_include_aliases ?? false,
        organisation: true,
      },
      active_accounts_only: true,
    };
  }

  const individualCriteria = formValue.fsa_search_account_individuals_search_criteria;

  return {
    ...baseSearchParams,
    defendant: {
      ...OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFENDANT_DEFAULTS,
      surname: individualCriteria.fsa_search_account_individuals_last_name,
      exact_match_surname: individualCriteria.fsa_search_account_individuals_last_name_exact_match ?? false,
      forenames: individualCriteria.fsa_search_account_individuals_first_names,
      exact_match_forenames: individualCriteria.fsa_search_account_individuals_first_names_exact_match ?? false,
      include_aliases: individualCriteria.fsa_search_account_individuals_include_aliases ?? false,
      organisation: false,
    },
    active_accounts_only: true,
  };
};
