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
import { FINES_REPORTS_ROUTING_PATHS } from '../routing/constants/fines-reports-routing-paths.constant';
import { FINES_REPORTS_REPORT_SUMMARY_PAGE_HEADING } from './constants/fines-reports-report-summary-page-heading.constant';
import { type IFinesReportsReportSummaryInstance } from './interfaces/fines-reports-report-summary-instance.interface';
import { type IFinesReportsReportSummaryViewModel } from './interfaces/fines-reports-report-summary-view-model.interface';
import { FinesReportsReportSummaryRowValueComponent } from './components/fines-reports-report-summary-row-value/fines-reports-report-summary-row-value.component';
import { mapFinesReportsReportSummaryToViewModel } from './utils/fines-reports-report-summary-map-view-model.utils';

@Component({
  selector: 'app-fines-reports-report-summary',
  imports: [
    GovukBackLinkComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    FinesReportsReportSummaryRowValueComponent,
  ],
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
  private readonly reportSummarySignal = toSignal(
    this.activatedRoute.data.pipe(
      map((routeData) => routeData['reportSummary'] as IFinesReportsReportSummaryInstance | null | undefined),
    ),
    {
      initialValue: this.activatedRoute.snapshot.data['reportSummary'] as
        | IFinesReportsReportSummaryInstance
        | null
        | undefined,
    },
  );

  /**
   * Maps the selected report instance route data into the report summary data for this UI slice.
   */
  public readonly reportSummary = computed(() => this.reportSummarySignal() ?? null);

  /**
   * Returns the report summary rows used by the template.
   */
  public readonly reportSummaryViewModel = computed((): IFinesReportsReportSummaryViewModel => {
    const reportSummary = this.reportSummary();

    return reportSummary
      ? mapFinesReportsReportSummaryToViewModel(reportSummary)
      : {
          generalRows: [],
          criteriaRows: [],
          errorRows: [],
        };
  });

  /**
   * Returns the report summary page heading for the selected report instance.
   */
  public readonly pageHeading = computed(() => {
    const reportSummary = this.reportSummary();

    if (!reportSummary) {
      return FINES_REPORTS_REPORT_SUMMARY_PAGE_HEADING.default;
    }

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
}
