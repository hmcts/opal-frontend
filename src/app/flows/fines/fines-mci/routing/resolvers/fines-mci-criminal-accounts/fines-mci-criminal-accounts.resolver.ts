import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { forkJoin, map, of } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FinesMciStore } from '../../../stores/fines-mci.store';
import { buildFinesMciCriminalAccountSearchParams } from '../../../utils/fines-mci-criminal-account-search-params.utils';
import { IFinesMciCriminalAccountsResponse } from '../../../interfaces/fines-mci-criminal-accounts-response.interface';
import { FINES_MCI_ROUTING_PATHS } from '../../constants/fines-mci-routing-paths.constant';
import { FINES_MCI_CRIMINAL_SEARCH_RESULTS } from '../../../constants/fines-mci-criminal-search-results.constant';
import { IFinesMciCriminalAccountsResult } from '../../../interfaces/fines-mci-criminal-accounts-result.interface';

/** Classifies either a fresh response or the unchanged results restored from the store. */
const classifySearchResults = (response: IFinesMciCriminalAccountsResponse): IFinesMciCriminalAccountsResult => {
  if (response.count > 100) {
    return { response, results: FINES_MCI_CRIMINAL_SEARCH_RESULTS.tooMany };
  }
  if (response.count === 0) {
    return { response, results: FINES_MCI_CRIMINAL_SEARCH_RESULTS.noMatches };
  }
  return { response, results: FINES_MCI_CRIMINAL_SEARCH_RESULTS.matches };
};

/**
 * Resolves the matches page from stored criteria, redirecting to search when required state is absent.
 * Conflicting criteria return a local outcome without calling the API. Account-number searches query
 * both party types and combine their counts and records; name searches use the selected tab.
 * Reuses stored results on return navigation; submitting a search clears them so the API is queried again.
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

  const storedResults = store.criminalSearchResults();
  if (storedResults) {
    return of(classifySearchResults(storedResults));
  }

  const accounts$ = search.formData.fsa_search_account_number
    ? forkJoin({
        individuals: opalFines.getDefendantAccounts(
          buildFinesMciCriminalAccountSearchParams(search, businessUnit.business_unit_id, false),
        ),
        companies: opalFines.getDefendantAccounts(
          buildFinesMciCriminalAccountSearchParams(search, businessUnit.business_unit_id, true),
        ),
      }).pipe(
        map(({ individuals, companies }) => ({
          count: individuals.count + companies.count,
          defendant_accounts: [...individuals.defendant_accounts, ...companies.defendant_accounts],
        })),
      )
    : opalFines.getDefendantAccounts(buildFinesMciCriminalAccountSearchParams(search, businessUnit.business_unit_id));

  return accounts$.pipe(map(classifySearchResults));
};
