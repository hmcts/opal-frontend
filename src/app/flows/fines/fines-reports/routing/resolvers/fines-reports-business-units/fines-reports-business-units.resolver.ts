import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { switchMap } from 'rxjs';
import { getFinesReportsRouteConfiguration } from '../../../utils/fines-reports-route.utils';

export const finesReportsBusinessUnitsResolver: ResolveFn<IOpalFinesBusinessUnitRefData> = (route) => {
  const opalFinesService = inject(OpalFines);
  const reportConfiguration = getFinesReportsRouteConfiguration(route);

  if (!reportConfiguration || reportConfiguration.isYourReports) {
    return opalFinesService.getBusinessUnits();
  }

  return opalFinesService.getReport(reportConfiguration.reportTypeId).pipe(
    switchMap((report) => {
      const permission = report.report_permission ?? report.permission;

      return permission
        ? opalFinesService.getBusinessUnitsByPermission(permission)
        : opalFinesService.getBusinessUnits();
    }),
  );
};
