import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { getFinesReportsRouteConfiguration } from '../../../utils/fines-reports-route.utils';

export const finesReportsReportHeadingResolver: ResolveFn<string> = (route: ActivatedRouteSnapshot) => {
  return getFinesReportsRouteConfiguration(route)?.createHeading ?? '';
};
