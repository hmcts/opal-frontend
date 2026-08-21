import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GovukBackLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-back-link';
import {
  GovukSummaryListComponent,
  GovukSummaryListRowComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-summary-list';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../routing/constants/fines-reports-routing-paths.constant';
import { FinesNotProvidedComponent } from '../../components/fines-not-provided/fines-not-provided.component';
import { type IFinesReportsReportSummaryViewModel } from './interfaces/fines-reports-report-summary-view-model.interface';

@Component({
  selector: 'app-fines-reports-report-summary',
  imports: [
    GovukBackLinkComponent,
    GovukSummaryListComponent,
    GovukSummaryListRowComponent,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    FinesNotProvidedComponent,
  ],
  templateUrl: './fines-reports-report-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesReportsReportSummaryComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly routeWithReportTypeId = this.activatedRoute.parent ?? this.activatedRoute;

  public readonly reportSummary =
    (this.activatedRoute.snapshot.data['reportSummary'] as IFinesReportsReportSummaryViewModel | null | undefined) ??
    null;
  public readonly reportTypeId = this.routeWithReportTypeId.snapshot.paramMap.get('reportTypeId') ?? '';

  /**
   * Returns the report summary page heading for the selected report instance.
   */
  public get pageHeading(): string {
    const reportSummary = this.reportSummary;
    const reportHeading = reportSummary?.reportTitle || 'Operational report';

    if (!reportSummary) {
      return reportHeading;
    }

    return `${reportSummary.reportName} - ${reportSummary.reportType}`;
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
