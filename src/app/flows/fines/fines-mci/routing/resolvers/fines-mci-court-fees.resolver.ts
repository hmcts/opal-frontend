import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import { IOpalFinesCourtFeesResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-fees.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesMciStore } from '../../stores/fines-mci.store';

/** Loads fees before opening either court-fee screen; null lets the screen show its existing error. */
export const finesMciCourtFeesResolver: ResolveFn<IOpalFinesCourtFeesResponse | null> = () => {
  const businessUnitId = inject(FinesMciStore).businessUnit()?.business_unit_id;
  if (businessUnitId == null) return of(null);

  return inject(OpalFines)
    .getCourtFees(businessUnitId)
    .pipe(catchError(() => of(null)));
};
