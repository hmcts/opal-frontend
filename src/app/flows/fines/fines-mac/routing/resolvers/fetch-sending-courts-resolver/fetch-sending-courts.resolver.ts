import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesLocalJusticeAreaRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-local-justice-area-ref-data.interface';
import { Observable } from 'rxjs';

export const fetchSendingCourtsResolver: ResolveFn<
  IOpalFinesLocalJusticeAreaRefData
> = (): Observable<IOpalFinesLocalJusticeAreaRefData> => {
  const opalFinesService = inject(OpalFines);
  return opalFinesService.getLocalJusticeAreas();
};
