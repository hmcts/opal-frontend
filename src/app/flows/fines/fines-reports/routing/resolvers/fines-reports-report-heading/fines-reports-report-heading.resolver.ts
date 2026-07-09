import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { findFinesReportsDefinition } from '../../../constants/find-fines-reports-definition.constant';

export const finesReportsReportHeadingResolver: ResolveFn<string> = (route: ActivatedRouteSnapshot) => {
  const reportTypeId = route.paramMap.get('reportTypeId') ?? route.parent?.paramMap.get('reportTypeId');

  return findFinesReportsDefinition(reportTypeId)?.heading ?? '';
};
