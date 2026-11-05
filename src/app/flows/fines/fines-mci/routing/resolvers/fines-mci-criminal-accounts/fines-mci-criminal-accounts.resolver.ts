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
