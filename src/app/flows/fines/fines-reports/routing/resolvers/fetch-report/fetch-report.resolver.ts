import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesReport } from '@services/fines/opal-fines-service/interfaces/opal-fines-report.interface';
import { of } from 'rxjs';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from '../../../fines-reports-summary-list/constants/fines-reports-summary-list-report-configuration.constant';

export const fetchReportResolver: ResolveFn<IOpalFinesReport | null> = (route: ActivatedRouteSnapshot) => {
  const opalFinesService = inject(OpalFines);
  const reportTypeId = route.paramMap.get('reportTypeId') ?? route.parent?.paramMap.get('reportTypeId') ?? '';
  const report = FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((config) => config.id === reportTypeId);

  if (!report?.permissionIds.length) {
    return of(null);
  }

  return opalFinesService.getReport(reportTypeId);
};
