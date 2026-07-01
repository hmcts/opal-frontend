import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { findFinesReportsDefinition } from '../../../constants/fines-reports-definitions.constant';

export const finesReportsReportHeadingResolver: ResolveFn<string> = (route: ActivatedRouteSnapshot) => {
  const reportId = route.paramMap.get('reportId') ?? route.parent?.paramMap.get('reportId');

  return findFinesReportsDefinition(reportId)?.heading ?? '';
};
