import { inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ResolveFn, Router } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { map, of, catchError } from 'rxjs';
import { IOpalFinesSearchOffencesData } from '@services/fines/opal-fines-service/interfaces/opal-fines-search-offences.interface';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_ROUTING_TITLES } from '../constants/fines-mac-offence-details-search-offences-routing-titles.constant';

export const finesMacOffenceDetailsSearchOffencesResolver: ResolveFn<IOpalFinesSearchOffencesData> = () => {
  const router = inject(Router);
  const opalFinesService = inject(OpalFines);
  const dateService = inject(DateService);
  const utilsService = inject(UtilsService);
  const title = inject(Title);
  const emptyResult = { searchData: [], count: 0 };

  const setPageTitle = (hasResults: boolean): void => {
    const pageTitle = hasResults
      ? FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_ROUTING_TITLES.children.searchOffencesResults
      : FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_ROUTING_TITLES.children.noResultsFound;

    title.setTitle(`OPAL - ${pageTitle}`);
  };

  // Access the router state to retrieve navigation extras passed from the previous component
  const nav = router.currentNavigation();
  const state = nav?.extras.state as {
    payload?: Record<string, unknown>;
  };

  // If no form data was passed through navigation state, return an empty result
  if (!state?.payload) {
    setPageTitle(false);
    return of(emptyResult);
  }

  const todayIsoDate = dateService.getDateNow().toUTC().toISO()!;

  // Build the initial request payload from the provided search form data
  const body = {
    active_date: state.payload['inactive'] === true ? null : todayIsoDate,
    cjs_code: state.payload['code'],
    title: state.payload['short_title'],
    act_and_section: state.payload['act_section'],
  };

  // Filter out any undefined or null fields from the request payload
  const filteredBody = utilsService.filterNullOrUndefined(body);

  // Call the offence search API and map the response to a simplified table structure
  return opalFinesService.searchOffences(filteredBody).pipe(
    map((response: IOpalFinesSearchOffencesData) => {
      setPageTitle(response.searchData.length > 0);
      return response;
    }),
    catchError(() => {
      utilsService.scrollToTop();
      setPageTitle(false);
      return of(emptyResult);
    }),
  );
};
