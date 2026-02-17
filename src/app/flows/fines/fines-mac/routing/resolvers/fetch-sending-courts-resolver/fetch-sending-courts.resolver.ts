import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesLocalJusticeAreaRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-local-justice-area-ref-data.interface';
import { Observable } from 'rxjs';
import { FinesMacStore } from '../../../stores/fines-mac.store';

export const fetchSendingCourtsResolver: ResolveFn<
  IOpalFinesLocalJusticeAreaRefData
> = (): Observable<IOpalFinesLocalJusticeAreaRefData> => {
  const opalFinesService = inject(OpalFines);
  const originatorType = inject(FinesMacStore).originatorType().formData.fm_originator_type_originator_type!;

  return opalFinesService.getLocalJusticeAreas(originatorType);
};
