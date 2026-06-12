import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesReport } from '@services/fines/opal-fines-service/interfaces/opal-fines-report.interface';
import { of } from 'rxjs';
import { getFinesReportsRouteConfiguration } from '../../../utils/fines-reports-route.utils';

export const finesReportsReportMetadataResolver: ResolveFn<IOpalFinesReport | null> = (route) => {
  const opalFinesService = inject(OpalFines);
  const reportConfiguration = getFinesReportsRouteConfiguration(route);

  if (!reportConfiguration || reportConfiguration.isYourReports) {
    return of(null);
  }

  return opalFinesService.getReport(reportConfiguration.reportTypeId);
};
