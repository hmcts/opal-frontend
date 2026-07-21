import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from '@app/flows/fines/fines-reports/fines-reports-summary-list/constants/fines-reports-summary-list-report-configuration.constant';
import { FINES_REPORTS_ROUTING_TITLES } from '../../constants/fines-reports-routing-titles.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../../constants/fines-reports-routing-paths.constant';

const getFinesReportsChildRouteTitle = (route: ActivatedRouteSnapshot): string | null => {
  const routePath = route.routeConfig?.path;

  if (routePath === FINES_REPORTS_ROUTING_PATHS.children.create) {
    return FINES_REPORTS_ROUTING_TITLES.children.create;
  }

  if (routePath === `${FINES_REPORTS_ROUTING_PATHS.children.reportSummary}/:reportInstanceId`) {
    return FINES_REPORTS_ROUTING_TITLES.children.reportSummary;
  }

  return null;
};

export const finesReportsTitleResolver: ResolveFn<string> = (route: ActivatedRouteSnapshot) => {
  const titleService = inject(Title);
  const reportId =
    route.paramMap.get('reportTypeId') ??
    route.paramMap.get('reportId') ??
    route.parent?.paramMap.get('reportTypeId') ??
    route.parent?.paramMap.get('reportId');
  const pageTitle =
    getFinesReportsChildRouteTitle(route) ??
    FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((config) => config.id === reportId)?.title ??
    FINES_REPORTS_ROUTING_TITLES.root;

  titleService.setTitle(`OPAL - ${pageTitle}`);

  return pageTitle;
};
