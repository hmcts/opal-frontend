import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { AbstractReportSummaryListBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-report-summary-list-base';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesReportInstancesParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-report-instances-params.interface';
import { IOpalFinesReportInstancesResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-report-instances-response.interface';
import {
  getFinesReportsRouteConfiguration,
  getFinesReportsRouteReportTypeId,
} from '../../../utils/fines-reports-route.utils';
import { FinesReportsSummaryListStore } from '../../../fines-reports-summary-list/stores/fines-reports-summary-list.store';
import { FINES_REPORTS_SUMMARY_LIST_ALL_BUSINESS_UNITS } from '../../../fines-reports-summary-list/constants/fines-reports-summary-list-state.constant';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';

export type FinesReportsReportInstancesResolverData = IOpalFinesReportInstancesResponse & {
  loadError?: boolean;
};

const FINES_REPORTS_REPORT_INSTANCES_LOAD_ERROR_RESPONSE: FinesReportsReportInstancesResolverData = {
  report_instances: [],
  count: 0,
  loadError: true,
};

const FINES_REPORTS_REPORT_INSTANCES_EMPTY_RESPONSE: FinesReportsReportInstancesResolverData = {
  report_instances: [],
  count: 0,
};

/**
 * Resolves report instance data for the selected fines report route.
 *
 * The resolver resets the summary list store for the active report type and builds a report-scoped request from
 * the current applied query or filter state. The "Your reports" placeholder resolves empty data without making a
 * report instances request.
 *
 * @param route - The activated route snapshot used to determine the report configuration and report type ID.
 * @returns An observable containing report instances, or an empty load-error response if the request fails.
 */
export const finesReportsReportInstancesResolver: ResolveFn<FinesReportsReportInstancesResolverData> = (route) => {
  const opalFinesService = inject(OpalFines);
  const store = inject(FinesReportsSummaryListStore);
  const dateService = inject(DateService);
  const reportConfiguration = getFinesReportsRouteConfiguration(route);
  const reportTypeId = getFinesReportsRouteReportTypeId(route);
  store.resetForReportType(reportTypeId);

  if (reportTypeId === FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports) {
    return of(FINES_REPORTS_REPORT_INSTANCES_EMPTY_RESPONSE);
  }

  const filters = store.filters();
  const businessUnit =
    filters.businessUnit && filters.businessUnit !== FINES_REPORTS_SUMMARY_LIST_ALL_BUSINESS_UNITS
      ? filters.businessUnit
      : null;

  const query = store.appliedQuery() ?? {
    ...AbstractReportSummaryListBaseComponent.getReportQueryFromFilters(filters, dateService),
    businessUnit,
  };

  const params: IOpalFinesReportInstancesParams = {
    from_date: query.fromDate,
    to_date: query.toDate,
    business_units: query.businessUnit ? [query.businessUnit] : undefined,
  };

  return opalFinesService
    .getReportInstances({
      ...params,
      report_id: reportConfiguration?.reportTypeId ?? null,
    })
    .pipe(catchError(() => of(FINES_REPORTS_REPORT_INSTANCES_LOAD_ERROR_RESPONSE)));
};
