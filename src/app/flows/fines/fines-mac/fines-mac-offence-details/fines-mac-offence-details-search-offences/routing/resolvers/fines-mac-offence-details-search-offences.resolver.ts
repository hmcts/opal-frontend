import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { map, of, catchError } from 'rxjs';
import { IOpalFinesSearchOffencesData } from '@services/fines/opal-fines-service/interfaces/opal-fines-search-offences.interface';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';

export const finesMacOffenceDetailsSearchOffencesResolver: ResolveFn<IOpalFinesSearchOffencesData> = () => {
  const router = inject(Router);
  const opalFinesService = inject(OpalFines);
  const dateService = inject(DateService);
  const utilsService = inject(UtilsService);
  const emptyResult = { searchData: [], count: 0 };

  // Access the router state to retrieve navigation extras passed from the previous component
  const nav = router.getCurrentNavigation();
  const state = nav?.extras.state as {
    payload?: Record<string, unknown>;
  };

  // If no form data was passed through navigation state, return an empty result
  if (!state?.payload) {
    return of(emptyResult);
  }

  const todayFormatted = dateService.getDateNow().toFormat('yyyy-MM-dd HH:mm:ss');

  // Build the initial request payload from the provided search form data
  const body = {
    activeDate: state.payload['inactive'] === true ? null : todayFormatted,
    cjsCode: state.payload['code'],
    title: state.payload['short_title'],
    actSection: state.payload['act_section'],
  };

  // Filter out any undefined or null fields from the request payload
  const filteredBody = utilsService.filterNullOrUndefined(body);

  // Call the offence search API and map the response to a simplified table structure
  return opalFinesService.searchOffences(filteredBody).pipe(
    map((response: IOpalFinesSearchOffencesData) => response),
    catchError(() => {
      utilsService.scrollToTop();
      return of(emptyResult);
    }),
  );
};
