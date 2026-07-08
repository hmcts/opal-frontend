import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { findFinesReportsDefinition } from '../../../constants/fines-reports-definitions.constant';

export const finesReportsReportHeadingResolver: ResolveFn<string> = (route: ActivatedRouteSnapshot) => {
  const reportTypeId = route.paramMap.get('reportTypeId') ?? route.parent?.paramMap.get('reportTypeId');

  return findFinesReportsDefinition(reportTypeId)?.heading ?? '';
};
