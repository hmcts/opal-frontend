import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IFinesReportsReportSummaryInstance } from '../../../fines-reports-report-summary/interfaces/fines-reports-report-summary-instance.interface';
import { catchError, map, of } from 'rxjs';
import { mapFinesReportsReportInstanceToReportSummary } from '../../../fines-reports-report-summary/utils/fines-reports-report-summary-map-report-instance.utils';

const REPORT_INSTANCE_ID_API_PATTERN = /^\d+$/;

export const fetchReportInstanceResolver: ResolveFn<IFinesReportsReportSummaryInstance | null> = (
  route: ActivatedRouteSnapshot,
) => {
  const opalFinesService = inject(OpalFines);
  const reportInstanceId =
    route.paramMap.get('reportInstanceId') ?? route.parent?.paramMap.get('reportInstanceId') ?? '';
  const reportId = route.parent?.paramMap.get('reportId') ?? route.paramMap.get('reportId') ?? '';

  if (!reportInstanceId || !REPORT_INSTANCE_ID_API_PATTERN.test(reportInstanceId)) {
    return of(null);
  }

  return opalFinesService.getReportInstance(reportInstanceId).pipe(
    map((reportInstance) => mapFinesReportsReportInstanceToReportSummary(reportInstance, reportId)),
    catchError(() => of(null)),
  );
};
