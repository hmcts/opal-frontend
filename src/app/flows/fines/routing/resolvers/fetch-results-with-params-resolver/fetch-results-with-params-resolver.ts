import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { IOpalFinesResultsParams } from '@app/flows/fines/services/opal-fines-service/interfaces/opal-fines-results-params.interface';

export const fetchResultsWithParamsResolver: ResolveFn<IOpalFinesResultsRefData> = (route: ActivatedRouteSnapshot) => {
  const resultsParams = route.data['resultsParams'] as IOpalFinesResultsParams;
  const opalFinesService = inject(OpalFines);
  return opalFinesService.getResults([], resultsParams);
};
