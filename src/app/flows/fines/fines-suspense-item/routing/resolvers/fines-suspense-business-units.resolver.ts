import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';

export const finesSuspenseBusinessUnitsResolver: ResolveFn<IOpalFinesBusinessUnitRefData> = () => {
  const opalFines = inject(OpalFines);

  // The API accepts one permission per request; either permission grants access to search.
  return forkJoin([
    opalFines.getBusinessUnitsByPermission('VIEW_SUSPENSE_ITEMS'),
    opalFines.getBusinessUnitsByPermission('MANAGE_SUSPENSE_ITEMS'),
  ]).pipe(
    map(([view, manage]) => {
      const businessUnits = new Map([...view.refData, ...manage.refData].map((unit) => [unit.business_unit_id, unit]));
      const refData = [...businessUnits.values()];
      return { count: refData.length, refData };
    }),
  );
};
