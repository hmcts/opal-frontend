import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IFinesReportsReportSummaryViewModel } from '../../../fines-reports-report-summary/interfaces/fines-reports-report-summary-view-model.interface';
import { catchError, map, of } from 'rxjs';
import { mapFinesReportsReportInstanceToViewModel } from '../../../fines-reports-report-summary/utils/fines-reports-report-summary-map-view-model.utils';

const REPORT_INSTANCE_ID_API_PATTERN = /^\d+$/;

export const fetchReportInstanceResolver: ResolveFn<IFinesReportsReportSummaryViewModel | null> = (
  route: ActivatedRouteSnapshot,
) => {
  const opalFinesService = inject(OpalFines);
  const reportInstanceId = route.paramMap.get('instanceId') ?? '';
  const reportTypeId = route.parent?.paramMap.get('reportTypeId') ?? route.paramMap.get('reportTypeId') ?? '';

  if (!reportInstanceId || !REPORT_INSTANCE_ID_API_PATTERN.test(reportInstanceId)) {
    return of(null);
  }

  return opalFinesService.getReportInstance(reportInstanceId).pipe(
    map((reportInstance) => mapFinesReportsReportInstanceToViewModel(reportInstance, reportTypeId)),
    catchError(() => of(null)),
  );
};
