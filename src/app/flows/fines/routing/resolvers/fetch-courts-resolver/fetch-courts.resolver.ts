import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesCourtRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-ref-data.interface';

/**
 * Builds a courts resolver using the provided business unit id getter.
 *
 * The getter runs inside Angular's injection context so journey-specific stores
 * can still be injected by the wrapper resolver.
 */
export const buildFetchCourtsResolver = (getBusinessUnitId: () => number): ResolveFn<IOpalFinesCourtRefData> => {
  return (): Observable<IOpalFinesCourtRefData> => {
    const opalFinesService = inject(OpalFines);

    return opalFinesService.getCourts(getBusinessUnitId());
  };
};
