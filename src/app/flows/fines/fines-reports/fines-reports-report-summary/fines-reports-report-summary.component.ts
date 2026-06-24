import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { map } from 'rxjs';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../routing/constants/fines-reports-routing-paths.constant';
import { FINES_REPORTS_REPORT_SUMMARY_PAGE_HEADING } from './constants/fines-reports-report-summary-page-heading.constant';
import { type IFinesReportsReportSummaryInstance } from './interfaces/fines-reports-report-summary-instance.interface';
import {
  FINES_REPORTS_REPORT_SUMMARY_ENFORCEMENT_MOCK,
  FINES_REPORTS_REPORT_SUMMARY_ERROR_MOCK,
  FINES_REPORTS_REPORT_SUMMARY_PAYMENTS_MOCK,
} from './mocks/fines-reports-report-summary.mock';
import { mapFinesReportsReportSummaryToViewModel } from './utils/fines-reports-report-summary-map-view-model.utils';

const REPORT_SUMMARY_MOCKS_BY_INSTANCE_ID: Record<string, IFinesReportsReportSummaryInstance> = {
  [FINES_REPORTS_REPORT_SUMMARY_ENFORCEMENT_MOCK.report_instance_id]: FINES_REPORTS_REPORT_SUMMARY_ENFORCEMENT_MOCK,
  [FINES_REPORTS_REPORT_SUMMARY_PAYMENTS_MOCK.report_instance_id]: FINES_REPORTS_REPORT_SUMMARY_PAYMENTS_MOCK,
  [FINES_REPORTS_REPORT_SUMMARY_ERROR_MOCK.report_instance_id]: FINES_REPORTS_REPORT_SUMMARY_ERROR_MOCK,
};

@Component({
  selector: 'app-fines-reports-report-summary',
  imports: [GovukBackLinkComponent, GovukSummaryListComponent, GovukSummaryListRowComponent],
  templateUrl: './fines-reports-report-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesReportsReportSummaryComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly routeWithReportId = this.activatedRoute.parent ?? this.activatedRoute;
  private readonly reportIdSignal = toSignal(
    this.routeWithReportId.paramMap.pipe(map((paramMap) => paramMap.get('reportId') ?? '')),
    {
      initialValue: this.routeWithReportId.snapshot.paramMap.get('reportId') ?? '',
    },
  );
  private readonly reportInstanceIdSignal = toSignal(
    this.activatedRoute.paramMap.pipe(map((paramMap) => paramMap.get('reportInstanceId') ?? '')),
    {
      initialValue: this.activatedRoute.snapshot.paramMap.get('reportInstanceId') ?? '',
    },
  );

  /**
   * Maps the selected report instance route parameter into the temporary report summary data for this UI slice.
   */
  public readonly reportSummary = computed(() => {
    return REPORT_SUMMARY_MOCKS_BY_INSTANCE_ID[this.reportInstanceId] ?? this.fallbackReportSummary;
  });

  /**
   * Returns the report summary rows used by the template.
   */
  public readonly reportSummaryViewModel = computed(() =>
    mapFinesReportsReportSummaryToViewModel(this.reportSummary()),
  );

  /**
   * Returns the report summary page heading for the selected report instance.
   */
  public readonly pageHeading = computed(() => {
    const reportSummary = this.reportSummary();
    const reportHeading =
      FINES_REPORTS_REPORT_SUMMARY_PAGE_HEADING.reports[reportSummary.report_id] ??
      FINES_REPORTS_REPORT_SUMMARY_PAGE_HEADING.default;

    return `${reportHeading} - ${reportSummary.report_reference} - ${reportSummary.report_type}`;
  });

  /**
   * Returns the report type id from the parent report route.
   */
  public get reportId(): string {
    return this.reportIdSignal();
  }

  /**
   * Returns the selected report instance id from the current summary route.
   */
  public get reportInstanceId(): string {
    return this.reportInstanceIdSignal();
  }

  /**
   * Navigates back to the current report summary list.
   */
  public navigateBack(): void {
    this.router.navigate([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_REPORTS_ROUTING_PATHS.root,
      this.reportId,
      FINES_REPORTS_ROUTING_PATHS.children.summaryList,
    ]);
  }

  /**
   * Provides a temporary report summary when the direct URL uses a report instance id that has no mock fixture.
   */
  private get fallbackReportSummary(): IFinesReportsReportSummaryInstance {
    return this.reportId === FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments
      ? FINES_REPORTS_REPORT_SUMMARY_PAYMENTS_MOCK
      : FINES_REPORTS_REPORT_SUMMARY_ENFORCEMENT_MOCK;
  }
}
