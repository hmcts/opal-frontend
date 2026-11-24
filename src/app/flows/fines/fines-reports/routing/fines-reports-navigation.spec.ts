import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterOutlet, Routes } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG } from '../../constants/release-feature-flags.constant';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { finesRouting } from '../../routing/fines.routes';
import { PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { AuthService } from '@hmcts/opal-frontend-common/services/auth-service';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_REPORTS_ROUTING_PATHS } from './constants/fines-reports-routing-paths.constant';

@Component({
  template: '<router-outlet />',
  imports: [RouterOutlet],
})
class ReportRouteStubComponent {}

// Keep the production route hierarchy and every guard; replace views and unrelated report-data resolvers.
const stubReportViews = (routes: Routes): Routes =>
  routes.map((route) =>
    route.redirectTo
      ? route
      : {
          ...route,
          component: ReportRouteStubComponent,
          loadComponent: undefined,
          resolve: undefined,
          children: route.children ? stubReportViews(route.children) : undefined,
        },
  );

describe('Reports navigation permissions', () => {
  const reportIds = FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children;
  const accessDeniedUrl = `/${PAGES_ROUTING_PATHS.children.accessDenied}`;
  const reportUrl = (reportId: string): string =>
    `/${FINES_ROUTING_PATHS.root}/${FINES_REPORTS_ROUTING_PATHS.root}/${reportId}/${FINES_REPORTS_ROUTING_PATHS.children.summaryList}`;
  let getLoggedInUserState: ReturnType<typeof vi.fn>;
  let reportingEnabled: boolean;

  const setPermissions = (permissionIds: number[]): void => {
    const userState = structuredClone(OPAL_USER_STATE_MOCK);
    userState.status = 'active';
    userState.business_unit_users = userState.business_unit_users.map((unit, index) => ({
      ...unit,
      permissions:
        index === 0 ? permissionIds.map((id) => ({ permission_id: id, permission_name: `Permission ${id}` })) : [],
    }));
    getLoggedInUserState.mockReturnValue(of(userState));
  };

  beforeEach(() => {
    reportingEnabled = true;
    getLoggedInUserState = vi.fn();
    setPermissions([FINES_PERMISSIONS['process-and-allocate-payments']]);
    const finesRoute = finesRouting.find((route) => route.children)!;
    const reportsRoute = finesRoute.children!.find(
      (route) => route.path === FINES_ROUTING_PATHS.children.reports.root,
    )!;
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          ...stubReportViews([{ ...finesRoute, children: [reportsRoute] }]),
          { path: PAGES_ROUTING_PATHS.children.accessDenied, component: ReportRouteStubComponent },
        ]),
        { provide: AuthService, useValue: { checkAuthenticated: () => of(true) } },
        { provide: OpalUserService, useValue: { getLoggedInUserState } },
        {
          provide: GlobalStore,
          useValue: {
            featureFlags: () => ({ [RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG]: reportingEnabled }),
          },
        },
      ],
    });
  });

  it('allows a payment-only user to follow the Cash List link through all parent and report guards', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl(reportUrl(reportIds.cashList));

    expect(TestBed.inject(Router).url).toBe(reportUrl(reportIds.cashList));
  });

  it.each([reportIds.operationalReportsByEnforcement, reportIds.operationalReportsByPayments, reportIds.yourReports])(
    'denies a payment-only user direct access to %s',
    async (reportId) => {
      const harness = await RouterTestingHarness.create();

      await harness.navigateByUrl(reportUrl(reportId));

      expect(TestBed.inject(Router).url).toBe(accessDeniedUrl);
    },
  );

  it.each([reportIds.operationalReportsByEnforcement, reportIds.operationalReportsByPayments, reportIds.yourReports])(
    'denies a payment-only user access to %s after entering Cash List',
    async (reportId) => {
      const harness = await RouterTestingHarness.create();
      await harness.navigateByUrl(reportUrl(reportIds.cashList));
      expect(TestBed.inject(Router).url).toBe(reportUrl(reportIds.cashList));

      await harness.navigateByUrl(reportUrl(reportId));

      expect(TestBed.inject(Router).url).toBe(accessDeniedUrl);
    },
  );

  it.each([
    { permissionIds: [] },
    { permissionIds: [FINES_PERMISSIONS['operational-report-by-enforcement']] },
    { permissionIds: [FINES_PERMISSIONS['operational-report-by-payments']] },
  ])('denies Cash List without payment allocation permission ($permissionIds)', async ({ permissionIds }) => {
    setPermissions(permissionIds);
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl(reportUrl(reportIds.cashList));

    expect(TestBed.inject(Router).url).toBe(accessDeniedUrl);
  });

  it.each([
    [reportIds.operationalReportsByEnforcement, FINES_PERMISSIONS['operational-report-by-enforcement']],
    [reportIds.operationalReportsByPayments, FINES_PERMISSIONS['operational-report-by-payments']],
    [reportIds.yourReports, FINES_PERMISSIONS['operational-report-by-enforcement']],
  ])('retains access to %s for an operational-report user', async (reportId, permissionId) => {
    setPermissions([permissionId]);
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl(reportUrl(reportId));

    expect(TestBed.inject(Router).url).toBe(reportUrl(reportId));
  });

  it('keeps Cash List behind the Reports release flag', async () => {
    reportingEnabled = false;
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl(reportUrl(reportIds.cashList));

    expect(TestBed.inject(Router).url).toBe(accessDeniedUrl);
  });
});
