import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, ResolveFn, convertToParamMap } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { finesReportsTitleResolver } from './fines-reports-title.resolver';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '@app/flows/fines/fines-reports/fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from '@app/flows/fines/fines-reports/fines-reports-summary-list/constants/fines-reports-summary-list-report-configuration.constant';
import { FINES_REPORTS_ROUTING_TITLES } from '../../constants/fines-reports-routing-titles.constant';

describe('finesReportsTitleResolver', () => {
  const executeResolver: ResolveFn<string> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => finesReportsTitleResolver(...resolverParameters));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockTitleService: any;

  const buildRoute = (reportId: string | null) =>
    ({
      paramMap: convertToParamMap(reportId ? { reportId } : {}),
      parent: reportId ? undefined : { paramMap: convertToParamMap({ reportId: 'parent-report-id' }) },
    }) as ActivatedRouteSnapshot;

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
});
