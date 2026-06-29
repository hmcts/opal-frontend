import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from '@app/flows/fines/fines-reports/fines-reports-summary-list/constants/fines-reports-summary-list-report-configuration.constant';
import { FINES_REPORTS_ROUTING_TITLES } from '../../constants/fines-reports-routing-titles.constant';

export const finesReportsTitleResolver: ResolveFn<string> = (route: ActivatedRouteSnapshot) => {
  const titleService = inject(Title);
  const reportTypeId = route.paramMap.get('reportTypeId') ?? route.parent?.paramMap.get('reportTypeId');
  const pageTitle =
    FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((config) => config.id === reportTypeId)?.title ??
    FINES_REPORTS_ROUTING_TITLES.root;

  titleService.setTitle(`OPAL - ${pageTitle}`);

  return pageTitle;
};
