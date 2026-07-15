import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesReportInstancesParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-report-instances-params.interface';
import { IOpalFinesReportInstancesResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-report-instances-response.interface';
import {
  getFinesReportsRouteConfiguration,
  getFinesReportsRouteReportTypeId,
} from '../../../utils/fines-reports-route.utils';
import {
  getDefaultReportsSummaryListQuery,
  getReportsSummaryListQueryFromFilters,
} from '../../../fines-reports-summary-list/utils/fines-reports-summary-list-date.utils';
import { FinesReportsSummaryListStore } from '../../../fines-reports-summary-list/stores/fines-reports-summary-list.store';

export const finesReportsReportInstancesResolver: ResolveFn<IOpalFinesReportInstancesResponse> = (route) => {
  const opalFinesService = inject(OpalFines);
  const globalStore = inject(GlobalStore);
  const store = inject(FinesReportsSummaryListStore);
  const dateService = inject(DateService);
  const reportConfiguration = getFinesReportsRouteConfiguration(route);
  const reportTypeId = getFinesReportsRouteReportTypeId(route);
  store.resetForReportType(reportTypeId);
  const userState = globalStore.userState();

  const query =
    store.appliedQuery() ??
    getReportsSummaryListQueryFromFilters(store.filters(), dateService) ??
    getDefaultReportsSummaryListQuery(dateService);

  const params: IOpalFinesReportInstancesParams = {
    from_date: query.fromDate,
    to_date: query.toDate,
    business_units: query.businessUnit ? [query.businessUnit] : undefined,
  };

  if (reportConfiguration?.isYourReports) {
    return opalFinesService.getReportInstances({
      ...params,
      user_id: userState.user_id,
    });
  }

  return opalFinesService.getReportInstances({
    ...params,
    report_id: reportConfiguration?.reportTypeId ?? null,
  });
};
