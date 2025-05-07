import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { map, of, catchError } from 'rxjs';
import { IOpalFinesSearchOffencesData } from '@services/fines/opal-fines-service/interfaces/opal-fines-search-offences.interface';
import { IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableData } from '../../fines-mac-offence-details-search-offences-results/fines-mac-offence-details-search-offences-results-table-wrapper/interfaces/fines-mac-offence-details-search-offences-results-table-wrapper-table-data.interface';
import { IFinesMacOffenceDetailsSearchOffencesState } from '../../interfaces/fines-mac-offence-details-search-offences-state.interface';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';

export const finesMacOffenceDetailsSearchOffencesResultsResolver: ResolveFn<
  IFinesMacOffenceDetailsSearchOffencesResultsTableWrapperTableData[]
> = () => {
  const router = inject(Router);
  const opalFinesService = inject(OpalFines);
  const dateService = inject(DateService);
  const utilsService = inject(UtilsService);

  // Access the router state to retrieve navigation extras passed from the previous component
  const nav = router.getCurrentNavigation();
  const state = nav?.extras.state as {
    searchForm?: IFinesMacOffenceDetailsSearchOffencesState;
  };

  // If no form data was passed through navigation state, return an empty result
  if (!state?.searchForm) {
    return of([]);
  }

  // Get today's date in ISO format using the shared DateService
  const todayIsoDate = dateService.getDateNow().toUTC().toISO()!;

  // Build the initial request payload from the provided search form data
  const body = {
    activeDate: state.searchForm.fm_offence_details_search_offences_inactive === true ? null : todayIsoDate,
    cjsCode: state.searchForm.fm_offence_details_search_offences_code,
    title: state.searchForm.fm_offence_details_search_offences_short_title,
    actAndSection: state.searchForm.fm_offence_details_search_offences_act_and_section,
  };

  // Filter out any undefined or null fields from the request payload
  const filteredBody = Object.entries(body).reduce(
    (acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key as keyof typeof body] = value;
      }
      return acc;
    },
    {} as typeof body,
  );

  // Call the offence search API and map the response to a simplified table structure
  return opalFinesService.searchOffences(filteredBody).pipe(
    map((response: IOpalFinesSearchOffencesData) =>
      response.searchData.map((offence) => ({
        Code: offence.cjs_code,
        'Short title': offence.offence_title,
        'Act and section': offence.offence_oas,
        'Used from': offence.date_used_from,
        'Used to': offence.date_used_to,
      })),
    ),
    catchError(() => {
      utilsService.scrollToTop();
      return of([]);
    }),
  );
};
