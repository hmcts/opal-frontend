import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { Observable } from 'rxjs';
import { FinesMacStore } from '../../../stores/fines-mac.store';
import { IOpalFinesProsecutorRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-prosecutor-ref-data.interface';

export const fetchProsecutorsResolver: ResolveFn<
  IOpalFinesProsecutorRefData
> = (): Observable<IOpalFinesProsecutorRefData> => {
  const opalFinesService = inject(OpalFines);
  const finesMacStore = inject(FinesMacStore);

  return opalFinesService.getProsecutors(finesMacStore.businessUnit().business_unit_id);
};
