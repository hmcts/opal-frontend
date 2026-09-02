import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { IOpalFinesBusinessUnitOutstandingAutoPaymentCounts } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-outstanding-auto-payment-counts.interface';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';

export const finesApiBusinessUnitCountsResolver: ResolveFn<IOpalFinesBusinessUnitOutstandingAutoPaymentCounts> = () => {
  const opalFinesService = inject(OpalFines);

  return opalFinesService.getBusinessUnitOutstandingAutoPaymentCounts();
};
