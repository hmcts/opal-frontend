import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesResultsRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-results-ref-data.interface';
import { FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES } from '../../../constants/fines-mac-offence-details-result-codes.constant';

export const fetchResultsResolver: ResolveFn<IOpalFinesResultsRefData> = () => {
  const opalFinesService = inject(OpalFines);
  const resultCodeArray: string[] = Object.values(FINES_MAC_OFFENCE_DETAILS_RESULTS_CODES);
  return opalFinesService.getResults(resultCodeArray);
};
