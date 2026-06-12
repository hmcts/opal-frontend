import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesReportInstancesParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-report-instances-params.interface';
import { IOpalFinesReportInstancesResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-report-instances-response.interface';
import { map, switchMap } from 'rxjs';
import { getFinesReportsRouteConfiguration } from '../../../utils/fines-reports-route.utils';
import {
  getDefaultReportsSummaryListQuery,
  getReportsSummaryListQueryFromFilters,
} from '../../../fines-reports-summary-list/utils/fines-reports-summary-list-date.utils';
import { FinesReportsSummaryListStore } from '../../../fines-reports-summary-list/stores/fines-reports-summary-list.store';

export const finesReportsReportInstancesResolver: ResolveFn<IOpalFinesReportInstancesResponse> = (route) => {
  const opalFinesService = inject(OpalFines);
  const opalUserService = inject(OpalUserService);
  const store = inject(FinesReportsSummaryListStore);
  const reportConfiguration = getFinesReportsRouteConfiguration(route);
  const query =
    store.appliedQuery() ??
    getReportsSummaryListQueryFromFilters(store.filters()) ??
    getDefaultReportsSummaryListQuery();

  const params: IOpalFinesReportInstancesParams = {
    from_date: query.fromDate,
    to_date: query.toDate,
    business_units: query.businessUnit ? [query.businessUnit] : undefined,
  };

  if (reportConfiguration?.isYourReports) {
    return opalUserService.getLoggedInUserState().pipe(
      switchMap((userState) =>
        opalFinesService.getReportInstances({
          ...params,
          user_id: userState.user_id,
        }),
      ),
    );
  }

  return opalFinesService
    .getReportInstances({
      ...params,
      report_id: reportConfiguration?.reportTypeId ?? null,
    })
    .pipe(map((response) => response));
};
