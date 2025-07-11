import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesCourtRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-court-ref-data.interface';
import { Observable } from 'rxjs';
import { FinesMacStore } from '../../../stores/fines-mac.store';

export const fetchEnforcementCourtsResolver: ResolveFn<
  IOpalFinesCourtRefData
> = (): Observable<IOpalFinesCourtRefData> => {
  const opalFinesService = inject(OpalFines);
  const finesMacStore = inject(FinesMacStore);

  return opalFinesService.getCourts(finesMacStore.businessUnit().business_unit_id);
};
