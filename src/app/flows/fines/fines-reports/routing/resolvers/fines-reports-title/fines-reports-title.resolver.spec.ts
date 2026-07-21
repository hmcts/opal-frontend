import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, ResolveFn, convertToParamMap } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { finesReportsTitleResolver } from './fines-reports-title.resolver';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '@app/flows/fines/fines-reports/fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from '@app/flows/fines/fines-reports/fines-reports-summary-list/constants/fines-reports-summary-list-report-configuration.constant';
import { FINES_REPORTS_ROUTING_TITLES } from '../../constants/fines-reports-routing-titles.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../../constants/fines-reports-routing-paths.constant';

describe('finesReportsTitleResolver', () => {
  const executeResolver: ResolveFn<string> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => finesReportsTitleResolver(...resolverParameters));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockTitleService: any;

  const buildRoute = (reportId: string | null, parentReportId?: string, routePath?: string) => {
    const parentRoute = parentReportId ? { paramMap: convertToParamMap({ reportId: parentReportId }) } : undefined;

    const parent = reportId ? undefined : parentRoute;

    return {
      paramMap: convertToParamMap(reportId ? { reportId } : {}),
      parent,
      routeConfig: routePath ? { path: routePath } : undefined,
    } as ActivatedRouteSnapshot;
  };

  beforeEach(() => {
    mockTitleService = {
      setTitle: vi.fn().mockName('Title.setTitle'),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: Title, useValue: mockTitleService }],
    });
  });

  it.each([
    FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports,
    FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
  ])('should set the OPAL document title for report id %s', (reportId) => {
    const route = buildRoute(reportId);
    const expectedTitle =
      FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((config) => config.id === reportId)?.title ??
      FINES_REPORTS_ROUTING_TITLES.root;

    const result = executeResolver(route, {} as never);

    expect(result).toBe(expectedTitle);
    expect(mockTitleService.setTitle).toHaveBeenCalledWith(`OPAL - ${expectedTitle}`);
  });

  it('should fall back to the reports root title when the report id is unknown', () => {
    const route = buildRoute('unknown-report-id');

    const result = executeResolver(route, {} as never);

    expect(result).toBe(FINES_REPORTS_ROUTING_TITLES.root);
    expect(mockTitleService.setTitle).toHaveBeenCalledWith(`OPAL - ${FINES_REPORTS_ROUTING_TITLES.root}`);
  });

  it('should use the parent route report id when the child route does not include one', () => {
    const route = buildRoute(null, FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments);
    const expectedTitle =
      FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find(
        (config) => config.id === FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
      )?.title ?? FINES_REPORTS_ROUTING_TITLES.root;

    const result = executeResolver(route, {} as never);

    expect(result).toBe(expectedTitle);
    expect(mockTitleService.setTitle).toHaveBeenCalledWith(`OPAL - ${expectedTitle}`);
  });

  it('should set the create report title for the create child route', () => {
    const route = buildRoute(
      null,
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
      FINES_REPORTS_ROUTING_PATHS.children.create,
    );

    const result = executeResolver(route, {} as never);

    expect(result).toBe(FINES_REPORTS_ROUTING_TITLES.children.create);
    expect(mockTitleService.setTitle).toHaveBeenCalledWith(
      `OPAL - ${FINES_REPORTS_ROUTING_TITLES.children.create}`,
    );
  });

  it('should set the report summary title for the report summary child route', () => {
    const route = buildRoute(
      null,
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
      `${FINES_REPORTS_ROUTING_PATHS.children.reportSummary}/:reportInstanceId`,
    );

    const result = executeResolver(route, {} as never);

    expect(result).toBe(FINES_REPORTS_ROUTING_TITLES.children.reportSummary);
    expect(mockTitleService.setTitle).toHaveBeenCalledWith(
      `OPAL - ${FINES_REPORTS_ROUTING_TITLES.children.reportSummary}`,
    );
  });
});
