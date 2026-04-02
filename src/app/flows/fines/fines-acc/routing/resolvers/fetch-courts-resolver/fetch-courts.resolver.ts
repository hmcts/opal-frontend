import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesCourtRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-ref-data.interface';
import { FinesAccountStore } from '../../../stores/fines-acc.store';

export const fetchCourtsResolver: ResolveFn<IOpalFinesCourtRefData> = (): Observable<IOpalFinesCourtRefData> => {
  const opalFinesService = inject(OpalFines);
  const finesAccStore = inject(FinesAccountStore);

  return opalFinesService.getCourts(Number(finesAccStore.business_unit_id()));
};
