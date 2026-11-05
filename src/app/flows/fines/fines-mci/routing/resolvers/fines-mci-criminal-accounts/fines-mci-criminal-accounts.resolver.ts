import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { forkJoin, map, of } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesDefendantAccountSearchParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account-search-params.interface';
import { OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFAULTS } from '@services/fines/opal-fines-service/constants/opal-fines-defendant-account-search-params-defaults.constant';
import { OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_DEFENDANT_DEFAULTS } from '@services/fines/opal-fines-service/constants/opal-fines-defendant-account-search-params-defendant-defaults.constant';
import { OPAL_FINES_DEFENDANT_ACCOUNT_SEARCH_PARAMS_REFERENCE_DEFAULTS } from '@services/fines/opal-fines-service/constants/opal-fines-defendant-account-search-params-reference-defaults.constant';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FinesMciStore } from '../../../stores/fines-mci.store';
import { IFinesMciCriminalSearch } from '../../../stores/interfaces/fines-mci-criminal-search.interface';
import { FINES_MCI_ROUTING_PATHS } from '../../constants/fines-mci-routing-paths.constant';
import { FINES_MCI_CRIMINAL_SEARCH_RESULTS } from '../../../constants/fines-mci-criminal-search-results.constant';
import { IFinesMciCriminalAccountsResult } from '../../../interfaces/fines-mci-criminal-accounts-result.interface';

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
const buildSearchParams = (
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

/**
 * Resolves the matches page from stored criteria, redirecting to search when required state is absent.
 * Conflicting criteria return a local outcome without calling the API. Account-number searches query
 * both party types and combine their counts and records; name searches use the selected tab.
 * Classifies the total count as zero, 1–100, or over 100, and lets request errors propagate.
 *
 * @returns A redirect or an observable containing the search outcome and API response.
 */
export const finesMciCriminalAccountsResolver: ResolveFn<IFinesMciCriminalAccountsResult> = () => {
  const store = inject(FinesMciStore);
  const router = inject(Router);
  const opalFines = inject(OpalFines);
  const search = store.criminalSearch();
  const businessUnit = store.businessUnit();

  if (!search || !businessUnit) {
    return new RedirectCommand(
      router.createUrlTree([
        '/',
        FINES_ROUTING_PATHS.root,
        FINES_MCI_ROUTING_PATHS.root,
        FINES_MCI_ROUTING_PATHS.children.create,
        FINES_MCI_ROUTING_PATHS.children.till,
        FINES_MCI_ROUTING_PATHS.children.payment,
        FINES_MCI_ROUTING_PATHS.children.category,
        FINES_MCI_ROUTING_PATHS.children.criminal,
        FINES_MCI_ROUTING_PATHS.children.search,
      ]),
    );
  }

  if (search.searchCriteriaCannotBeCombined) {
    return of({ results: FINES_MCI_CRIMINAL_SEARCH_RESULTS.searchCriteriaCannotBeCombined, response: null });
  }

  const accounts$ = search.formData.fsa_search_account_number
    ? forkJoin({
        individuals: opalFines.getDefendantAccounts(buildSearchParams(search, businessUnit.business_unit_id, false)),
        companies: opalFines.getDefendantAccounts(buildSearchParams(search, businessUnit.business_unit_id, true)),
      }).pipe(
        map(({ individuals, companies }) => ({
          count: individuals.count + companies.count,
          defendant_accounts: [...individuals.defendant_accounts, ...companies.defendant_accounts],
        })),
      )
    : opalFines.getDefendantAccounts(buildSearchParams(search, businessUnit.business_unit_id));

  return accounts$.pipe(
    map((response): IFinesMciCriminalAccountsResult => {
      if (response.count > 100) {
        return { response, results: FINES_MCI_CRIMINAL_SEARCH_RESULTS.tooMany };
      }
      if (response.count === 0) {
        return { response, results: FINES_MCI_CRIMINAL_SEARCH_RESULTS.noMatches };
      }
      return { response, results: FINES_MCI_CRIMINAL_SEARCH_RESULTS.matches };
    }),
  );
};
