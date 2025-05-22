import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesMajorCreditorRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-major-creditor-ref-data.interface';
import { FinesMacStore } from '../../../../stores/fines-mac.store';

export const fetchMajorCreditorsResolver: ResolveFn<IOpalFinesMajorCreditorRefData> = () => {
  const opalFinesService = inject(OpalFines);
  const finesMacStore = inject(FinesMacStore);
  const businessUnitId = finesMacStore.getBusinessUnitId();
  return opalFinesService.getMajorCreditors(businessUnitId);
};
