import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { switchMap } from 'rxjs';

const getReportTypeId = (route: ActivatedRouteSnapshot): string =>
  route.paramMap?.get('reportTypeId') ?? route.parent?.paramMap?.get('reportTypeId') ?? '';

export const fetchBusinessUnitsResolver: ResolveFn<IOpalFinesBusinessUnitRefData> = (route: ActivatedRouteSnapshot) => {
  const opalFinesService = inject(OpalFines);
  const reportTypeId = getReportTypeId(route);
  const permission = route.data['permission'];

  if (typeof permission === 'string' && permission.length > 0) {
    return opalFinesService.getBusinessUnitsByPermission(permission);
  }

  if (reportTypeId) {
    return opalFinesService
      .getReport(reportTypeId)
      .pipe(
        switchMap((report) =>
          report.permission
            ? opalFinesService.getBusinessUnitsByPermission(report.permission)
            : opalFinesService.getBusinessUnits(),
        ),
      );
  }

  return opalFinesService.getBusinessUnits();
};
