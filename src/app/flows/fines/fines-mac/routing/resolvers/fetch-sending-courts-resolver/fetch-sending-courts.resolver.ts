import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesLocalJusticeAreaRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-local-justice-area-ref-data.interface';
import { Observable } from 'rxjs';
import { FinesMacStore } from '../../../stores/fines-mac.store';
import { getFetchSendingCourtsLjaTypes } from './helpers/fetch-sending-courts-lja-type.helper';

export const fetchSendingCourtsResolver: ResolveFn<
  IOpalFinesLocalJusticeAreaRefData
> = (): Observable<IOpalFinesLocalJusticeAreaRefData> => {
  const opalFinesService = inject(OpalFines);
  const finesMacStore = inject(FinesMacStore);
  const originatorType = finesMacStore.originatorType().formData.fm_originator_type_originator_type;
  const accountType = finesMacStore.accountDetails().formData.fm_create_account_account_type;
  const ljaTypes = getFetchSendingCourtsLjaTypes(originatorType, accountType);

  if (ljaTypes.length) {
    return opalFinesService.getLocalJusticeAreas(ljaTypes);
  }

  return opalFinesService.getLocalJusticeAreas();
};
