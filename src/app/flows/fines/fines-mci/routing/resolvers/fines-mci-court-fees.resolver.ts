import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import { IOpalFinesCourtFeesResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-fees.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesMciStore } from '../../stores/fines-mci.store';

/**
 * Loads the selected business unit's fees before activating either court-fee screen.
 *
 * @returns The fee response, or null when the business unit is missing or the request fails,
 * allowing the destination to display its error state.
 */
export const finesMciCourtFeesResolver: ResolveFn<IOpalFinesCourtFeesResponse | null> = () => {
  const businessUnitId = inject(FinesMciStore).businessUnit()?.business_unit_id;
  if (businessUnitId == null) return of(null);

  return inject(OpalFines)
    .getCourtFees(businessUnitId)
    .pipe(catchError(() => of(null)));
};
