import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesReport } from '@services/fines/opal-fines-service/interfaces/opal-fines-report.interface';
import { of } from 'rxjs';
import { getFinesReportsRouteConfiguration } from '../../../utils/fines-reports-route.utils';

/**
 * Resolves report metadata for the selected fines report route.
 *
 * Metadata is only loaded for configured report type routes. Routes without a report configuration, and the
 * "Your reports" route, resolve to null because they do not have report-specific metadata.
 *
 * @param route - The activated route snapshot used to determine the report configuration.
 * @returns An observable containing the report metadata, or null when no metadata should be loaded.
 */
export const finesReportsReportMetadataResolver: ResolveFn<IOpalFinesReport | null> = (route) => {
  const opalFinesService = inject(OpalFines);
  const reportConfiguration = getFinesReportsRouteConfiguration(route);

  if (!reportConfiguration || reportConfiguration.isYourReports) {
    return of(null);
  }

  return opalFinesService.getReport(reportConfiguration.reportTypeId);
};
