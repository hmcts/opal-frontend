import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { of, switchMap } from 'rxjs';
import { FINES_REPORTS_ROUTING_PATHS } from '../../constants/fines-reports-routing-paths.constant';
import {
  getFinesReportsRouteConfiguration,
  getFinesReportsRouteReportTypeId,
} from '../../../utils/fines-reports-route.utils';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';

const FINES_REPORTS_EMPTY_BUSINESS_UNIT_REF_DATA: IOpalFinesBusinessUnitRefData = {
  count: 0,
  refData: [],
};

export const finesReportsBusinessUnitsResolver: ResolveFn<IOpalFinesBusinessUnitRefData | RedirectCommand> = (
  route,
) => {
  const opalFinesService = inject(OpalFines);
  const router = inject(Router);
  const reportConfiguration = getFinesReportsRouteConfiguration(route);
  const isCreateReportRoute = route.parent?.routeConfig?.path === FINES_REPORTS_ROUTING_PATHS.children.create;

  if (getFinesReportsRouteReportTypeId(route) === FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports) {
    return of(FINES_REPORTS_EMPTY_BUSINESS_UNIT_REF_DATA);
  }

  if (!reportConfiguration) {
    return opalFinesService.getBusinessUnits();
  }

  return opalFinesService.getReport(reportConfiguration.reportTypeId).pipe(
    switchMap((report) => {
      if (isCreateReportRoute && report.can_manually_create === false) {
        return of(
          new RedirectCommand(
            router.createUrlTree([
              `/${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.reports.root}/${reportConfiguration.reportTypeId}/${FINES_REPORTS_ROUTING_PATHS.children.summaryList}`,
            ]),
          ),
        );
      }

      const permission = report.report_permission ?? report.permission;

      if (!permission) {
        return of(new RedirectCommand(router.createUrlTree([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`])));
      }

      return opalFinesService.getBusinessUnitsByPermission(permission);
    }),
  );
};
