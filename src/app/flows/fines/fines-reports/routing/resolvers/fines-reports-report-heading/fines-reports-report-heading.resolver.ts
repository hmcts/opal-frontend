import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { getFinesReportsRouteConfiguration } from '../../../utils/fines-reports-route.utils';

/**
 * Resolves the heading for the selected report's creation journey.
 *
 * @param route - The route snapshot used to identify the report configuration.
 * @returns The configured creation heading, or an empty string when no configuration exists.
 */
export const finesReportsReportHeadingResolver: ResolveFn<string> = (route: ActivatedRouteSnapshot) => {
  return getFinesReportsRouteConfiguration(route)?.createHeading ?? '';
};
