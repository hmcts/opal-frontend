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
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from '../fines-reports-summary-list/constants/fines-reports-summary-list-report-configuration.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../routing/constants/fines-reports-routing-paths.constant';
import { type IFinesReportsReportSummaryViewModel } from './interfaces/fines-reports-report-summary-view-model.interface';
import { FinesReportsReportSummaryRowValueComponent } from './components/fines-reports-report-summary-row-value/fines-reports-report-summary-row-value.component';

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
  private readonly reportInstanceIdSignal = toSignal(
    this.activatedRoute.paramMap.pipe(map((paramMap) => paramMap.get('instanceId') ?? '')),
    {
      initialValue: this.activatedRoute.snapshot.paramMap.get('instanceId') ?? '',
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
   * Returns the report summary rows used by the template.
   */
  public readonly reportSummaryViewModel = computed((): IFinesReportsReportSummaryViewModel => {
    return (
      this.reportSummary() ?? {
        reportId: this.reportTypeId,
        reportReference: '',
        reportType: '',
        generalRows: [],
        criteriaRows: [],
        errorRows: [],
      }
    );
  });

  /**
   * Returns the report summary page heading for the selected report instance.
   */
  public readonly pageHeading = computed(() => {
    const reportSummary = this.reportSummary();
    const reportHeading =
      FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find(
        (config) => config.id === (reportSummary?.reportId ?? this.reportTypeId),
      )?.heading || 'Operational report';

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
      this.reportTypeId,
      FINES_REPORTS_ROUTING_PATHS.children.summaryList,
    ]);
  }
}
