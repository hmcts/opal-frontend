import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesReport } from '@services/fines/opal-fines-service/interfaces/opal-fines-report.interface';
import { of } from 'rxjs';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from '../../../fines-reports-summary-list/constants/fines-reports-summary-list-report-configuration.constant';

export const fetchReportResolver: ResolveFn<IOpalFinesReport | null> = (route: ActivatedRouteSnapshot) => {
  const opalFinesService = inject(OpalFines);
  const reportId = route.paramMap.get('reportId') ?? route.parent?.paramMap.get('reportId') ?? '';
  const report = FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((config) => config.id === reportId);

  if (!report?.permissionIds.length) {
    return of(null);
  }

  return opalFinesService.getReport(reportId);
};
