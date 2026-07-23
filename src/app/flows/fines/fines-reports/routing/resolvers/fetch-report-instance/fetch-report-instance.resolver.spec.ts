import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RedirectCommand,
  ResolveFn,
  Router,
  UrlTree,
  convertToParamMap,
} from '@angular/router';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_REPORT_INSTANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-report-instance.mock';
import { OPAL_FINES_RESULT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-result-ref-data.mock';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { fetchReportInstanceResolver } from './fetch-report-instance.resolver';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';

describe('fetchReportInstanceResolver', () => {
  const executeResolver: ResolveFn<unknown> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => fetchReportInstanceResolver(...resolverParameters));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;
  let mockRouter: { createUrlTree: ReturnType<typeof vi.fn> };

  const buildRoute = (reportInstanceId: string | null, parentReportTypeId?: string) => {
    const parentRoute = parentReportTypeId
      ? { paramMap: convertToParamMap({ reportTypeId: parentReportTypeId }) }
      : undefined;

    return {
      paramMap: convertToParamMap(reportInstanceId ? { reportInstanceId } : {}),
      parent: parentRoute,
    } as ActivatedRouteSnapshot;
  };

  beforeEach(() => {
    mockOpalFinesService = {
      getReportInstance: vi.fn().mockReturnValue(of(OPAL_FINES_REPORT_INSTANCE_MOCK)),
      getResult: vi.fn().mockReturnValue(of(OPAL_FINES_RESULT_REF_DATA_MOCK)),
    };
    mockRouter = {
      createUrlTree: vi.fn().mockReturnValue({} as UrlTree),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('should resolve report summary data from the report instance API', async () => {
    const route = buildRoute(
      '12345',
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    );

    const result = await firstValueFrom(executeResolver(route, {} as never) as Observable<unknown>);

    expect(mockOpalFinesService.getReportInstance).toHaveBeenCalledWith('12345');
    expect(result).not.toBeNull();
  });

  it('should redirect to access denied when the report instance does not match the permitted route report type', async () => {
    mockOpalFinesService.getReportInstance.mockReturnValue(
      of({
        ...OPAL_FINES_REPORT_INSTANCE_MOCK,
        report: {
          ...OPAL_FINES_REPORT_INSTANCE_MOCK.report,
          id: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
        },
      }),
    );

    const result = await firstValueFrom(
      executeResolver(
        buildRoute('12345', FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement),
        {} as never,
      ) as Observable<unknown>,
    );

    expect(result).toBeInstanceOf(RedirectCommand);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
    expect(mockOpalFinesService.getResult).not.toHaveBeenCalled();
  });

  it('should fall back to null when the report instance API fails', async () => {
    mockOpalFinesService.getReportInstance.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 406, statusText: 'Not Acceptable' })),
    );
    const route = buildRoute('12345', FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments);

    const result = await firstValueFrom(executeResolver(route, {} as never) as Observable<unknown>);

    expect(result).toBeNull();
  });

  it('should resolve the selected last-enforcement action for the summary display', async () => {
    mockOpalFinesService.getReportInstance.mockReturnValue(
      of({
        ...OPAL_FINES_REPORT_INSTANCE_MOCK,
        report_parameters: {
          reportType: 'SUMMARY',
          reportEnforcementMode: 'LAST_ACTION',
          enforcementAction: 'BWTD',
        },
      }),
    );
    mockOpalFinesService.getResult.mockReturnValue(
      of({ ...OPAL_FINES_RESULT_REF_DATA_MOCK, result_id: 'BWTD', result_title: 'Bail Warrant - dated' }),
    );

    const result = await firstValueFrom(
      executeResolver(
        buildRoute('12345', FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement),
        {} as never,
      ) as Observable<unknown>,
    );

    expect(mockOpalFinesService.getResult).toHaveBeenCalledWith('BWTD');
    expect(result).toMatchObject({
      criteriaRows: [
        { key: 'Report Type', value: 'Summary' },
        { key: 'Enforcement', value: 'Last enforcement - Bail Warrant - dated (BWTD)' },
      ],
    });
  });

  it('should fall back to null when the report instance id is missing', async () => {
    const result = await firstValueFrom(executeResolver(buildRoute(null), {} as never) as Observable<unknown>);

    expect(mockOpalFinesService.getReportInstance).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should fall back to null when the report instance id is not in the API format', async () => {
    const result = await firstValueFrom(
      executeResolver(buildRoute('report-instance-enforcement-001'), {} as never) as Observable<unknown>,
    );

    expect(mockOpalFinesService.getReportInstance).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
