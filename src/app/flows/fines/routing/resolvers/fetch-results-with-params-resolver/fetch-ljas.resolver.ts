import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesLocalJusticeAreaRefData } from '@app/flows/fines/services/opal-fines-service/interfaces/opal-fines-local-justice-area-ref-data.interface';

export const fetchLocalJusticeAreasResolver: ResolveFn<IOpalFinesLocalJusticeAreaRefData> = () => {
  const opalFinesService = inject(OpalFines);
  return opalFinesService.getLocalJusticeAreas();
};
