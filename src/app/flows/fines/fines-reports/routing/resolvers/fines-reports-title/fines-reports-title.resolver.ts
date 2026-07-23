import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from '@app/flows/fines/fines-reports/fines-reports-summary-list/constants/fines-reports-summary-list-report-configuration.constant';
import { FINES_REPORTS_ROUTING_TITLES } from '../../constants/fines-reports-routing-titles.constant';

/**
 * Resolves the page title for fines report summary list routes.
 *
 * The title is selected from the configured report type using the current route or parent route report ID. If no
 * matching report configuration is found, the resolver falls back to the reports root title.
 *
 * @param route - The activated route snapshot used to read the report type ID.
 * @returns The resolved page title.
 */
export const finesReportsTitleResolver: ResolveFn<string> = (route) => {
  const titleService = inject(Title);
  const reportId =
    route.paramMap.get('reportTypeId') ??
    route.paramMap.get('reportId') ??
    route.parent?.paramMap.get('reportTypeId') ??
    route.parent?.paramMap.get('reportId');
  const pageTitle =
    FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((config) => config.id === reportId)?.title ??
    FINES_REPORTS_ROUTING_TITLES.root;

  titleService.setTitle(`OPAL - ${pageTitle}`);

  return pageTitle;
};
