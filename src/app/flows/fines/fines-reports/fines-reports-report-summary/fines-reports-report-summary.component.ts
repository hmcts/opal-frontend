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
import { type IFinesReportsReportSummaryViewModel } from './interfaces/fines-reports-report-summary-view-model.interface';
import { FinesReportsReportSummaryRowValueComponent } from './components/fines-reports-report-summary-row-value/fines-reports-report-summary-row-value.component';
import { FINES_REPORTS_REPORT_SUMMARY_HEADINGS } from './constants/fines-reports-report-summary-headings.constant';

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
  private readonly routeWithReportTypeId = this.activatedRoute.parent ?? this.activatedRoute;
  private readonly reportTypeIdSignal = toSignal(
    this.routeWithReportTypeId.paramMap.pipe(map((paramMap) => paramMap.get('reportTypeId') ?? '')),
    {
      initialValue: this.routeWithReportTypeId.snapshot.paramMap.get('reportTypeId') ?? '',
    },
  );
  private readonly reportSummarySignal = toSignal(
    this.activatedRoute.data.pipe(
      map((routeData) => routeData['reportSummary'] as IFinesReportsReportSummaryViewModel | null | undefined),
    ),
    {
      initialValue: this.activatedRoute.snapshot.data['reportSummary'] as
        | IFinesReportsReportSummaryViewModel
        | null
        | undefined,
    },
  );

  /**
   * Returns the resolved report summary view model for this UI slice.
   */
  public readonly reportSummary = computed(() => this.reportSummarySignal() ?? null);

  /**
   * Returns the report summary page heading for the selected report instance.
   */
  public readonly pageHeading = computed(() => {
    const reportSummary = this.reportSummary();
    const reportHeading =
      reportSummary?.reportTitle ||
      FINES_REPORTS_REPORT_SUMMARY_HEADINGS[reportSummary?.reportId ?? this.reportTypeId] ||
      'Operational report';

    if (!reportSummary) {
      return reportHeading;
    }

    return `${reportHeading} - ${reportSummary.reportReference} - ${reportSummary.reportType}`;
  });

  /**
   * Returns the report type id from the parent report route.
   */
  public get reportTypeId(): string {
    return this.reportTypeIdSignal();
  }

  /**
   * Navigates back to the current report summary list.
   */
  public navigateBack(): void {
    this.router.navigate([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_REPORTS_ROUTING_PATHS.root,
      this.reportTypeId,
      FINES_REPORTS_ROUTING_PATHS.children.summaryList,
    ]);
  }
}
