import { inject } from '@angular/core';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesEnforcersRefData } from '@app/flows/fines/services/opal-fines-service/interfaces/opal-fines-enforcers-ref-data.interface';
import { ResolveFn } from '@angular/router';

export const fetchEnforcersResolver: ResolveFn<IOpalFinesEnforcersRefData> = () => {
  const opalFinesService = inject(OpalFines);
  return opalFinesService.getEnforcers();
};
