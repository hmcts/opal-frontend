import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { Observable } from 'rxjs';
import { FinesMacStore } from '../../../stores/fines-mac.store';
import { IOpalFinesIssuingAuthorityRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-issuing-authority-ref-data.interface';

export const fetchIssuingAuthoritiesResolver: ResolveFn<
  IOpalFinesIssuingAuthorityRefData
> = (): Observable<IOpalFinesIssuingAuthorityRefData> => {
  const opalFinesService = inject(OpalFines);
  const finesMacStore = inject(FinesMacStore);

  return opalFinesService.getIssuingAuthorities(finesMacStore.businessUnit().business_unit_id);
};
