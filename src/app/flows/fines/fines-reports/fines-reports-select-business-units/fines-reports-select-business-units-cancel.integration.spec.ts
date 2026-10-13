import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FinesReportsBusinessUnitWarningComponent } from '../fines-reports-business-unit-warning/fines-reports-business-unit-warning.component';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_REPORTS_CREATE_ROUTING_PATHS } from '../routing/constants/fines-reports-create-routing-paths.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../routing/constants/fines-reports-routing-paths.constant';
import { FinesReportsStore } from '../stores/fines-reports.store';
import { FinesReportsSelectBusinessUnitsComponent } from './fines-reports-select-business-units.component';

@Component({
  selector: 'app-report-summary-stub',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ReportSummaryStubComponent {}

describe('Report business unit cancellation navigation', () => {
  const enforcementReportId = FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement;
  const paymentsReportId = FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments;
  const selectBusinessUnitsPath = FINES_REPORTS_CREATE_ROUTING_PATHS.children.selectBusinessUnits;
  const warningPath = FINES_REPORTS_CREATE_ROUTING_PATHS.children.businessUnitWarning;
  const summaryPath = FINES_REPORTS_ROUTING_PATHS.children.summaryList;
  const createPath = FINES_REPORTS_ROUTING_PATHS.children.create;
  const enforcementSelectionUrl = `/fines/reports/${enforcementReportId}/${createPath}/${selectBusinessUnitsPath}`;
  const paymentsSelectionUrl = `/fines/reports/${paymentsReportId}/${createPath}/${selectBusinessUnitsPath}`;
  const businessUnits = OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData.slice(0, 2);

  const setup = async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'fines/reports',
            providers: [FinesReportsStore],
            children: [
              {
                path: ':reportTypeId',
                children: [
                  { path: summaryPath, component: ReportSummaryStubComponent },
                  {
                    path: createPath,
                    children: [
                      {
                        path: selectBusinessUnitsPath,
                        component: FinesReportsSelectBusinessUnitsComponent,
                        canDeactivate: [canDeactivateGuard],
                        data: {
                          reportHeading: 'Operational report',
                          businessUnits: { refData: businessUnits },
                          report: { report_parameters: { business_unit_warning_threshold: 1 } },
                        },
                      },
                      { path: warningPath, component: FinesReportsBusinessUnitWarningComponent },
                    ],
                  },
                ],
              },
            ],
          },
        ]),
      ],
    }).compileComponents();

    const confirmation = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const harness = await RouterTestingHarness.create(enforcementSelectionUrl);

    return { confirmation, harness, router: TestBed.inject(Router) };
  };

  const clickCancel = async (harness: RouterTestingHarness) => {
    const cancel = harness.routeNativeElement!.querySelector<HTMLAnchorElement>('a.govuk-link')!;
    cancel.click();
    await harness.fixture.whenStable();
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should not carry enforcement cancellation confirmation into a new payments selection', async () => {
    const { confirmation, harness, router } = await setup();
    const checkbox = harness.routeNativeElement!.querySelector<HTMLInputElement>(
      `#business-unit-${businessUnits[0].business_unit_id}`,
    )!;

    checkbox.click();
    await clickCancel(harness);

    expect(confirmation).toHaveBeenCalledTimes(1);
    expect(router.url).toBe(`/fines/reports/${enforcementReportId}/${summaryPath}`);

    await harness.navigateByUrl(paymentsSelectionUrl, FinesReportsSelectBusinessUnitsComponent);

    const paymentsCheckboxes = harness.routeNativeElement!.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    expect(paymentsCheckboxes.length).toBeGreaterThan(1);
    expect(Array.from(paymentsCheckboxes).every((control) => !control.checked)).toBe(true);

    await clickCancel(harness);

    expect(router.url).toBe(`/fines/reports/${paymentsReportId}/${summaryPath}`);
    expect(confirmation).toHaveBeenCalledTimes(1);
  });

  it('should still confirm cancellation after returning from the warning with restored selections', async () => {
    const { confirmation, harness, router } = await setup();
    const selectAll = harness.routeNativeElement!.querySelector<HTMLInputElement>(
      '#fines_reports_select_business_unit_ids',
    )!;
    selectAll.click();
    harness.routeNativeElement!.querySelector<HTMLButtonElement>('#continue-create-report')!.click();
    await harness.fixture.whenStable();

    expect(router.url).toBe(`/fines/reports/${enforcementReportId}/${createPath}/${warningPath}`);
    expect(confirmation).not.toHaveBeenCalled();

    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('a.govuk-link')!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(router.url).toBe(enforcementSelectionUrl);
    expect(
      harness.routeNativeElement!.querySelector<HTMLInputElement>(
        `#business-unit-${businessUnits[0].business_unit_id}`,
      )!.checked,
    ).toBe(true);

    await clickCancel(harness);

    expect(confirmation).toHaveBeenCalledTimes(1);
    expect(router.url).toBe(`/fines/reports/${enforcementReportId}/${summaryPath}`);
  });
});
