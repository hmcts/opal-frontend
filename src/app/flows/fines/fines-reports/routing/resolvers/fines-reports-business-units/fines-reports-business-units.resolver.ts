import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { of, switchMap } from 'rxjs';
import {
  getFinesReportsRouteConfiguration,
  getFinesReportsRouteReportTypeId,
} from '../../../utils/fines-reports-route.utils';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';

const FINES_REPORTS_EMPTY_BUSINESS_UNIT_REF_DATA: IOpalFinesBusinessUnitRefData = {
  count: 0,
  refData: [],
};

export const finesReportsBusinessUnitsResolver: ResolveFn<IOpalFinesBusinessUnitRefData> = (route) => {
  const opalFinesService = inject(OpalFines);
  const reportConfiguration = getFinesReportsRouteConfiguration(route);

  if (getFinesReportsRouteReportTypeId(route) === FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports) {
    return of(FINES_REPORTS_EMPTY_BUSINESS_UNIT_REF_DATA);
  }

  if (!reportConfiguration) {
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
