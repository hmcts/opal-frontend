import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { map } from 'rxjs';

export const fetchBusinessUnitsResolver: ResolveFn<IOpalFinesBusinessUnitRefData> = (route: ActivatedRouteSnapshot) => {
  const opalFinesService = inject(OpalFines);
  const permission = route.data['permission'];

  return opalFinesService.getBusinessUnits(permission).pipe(map((response) => response));
};
