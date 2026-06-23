import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fines-reports-report-summary',
  templateUrl: './fines-reports-report-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesReportsReportSummaryComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly routeWithReportId = this.activatedRoute.parent ?? this.activatedRoute;

  /**
   * Returns the report type id from the parent report route.
   */
  public get reportId(): string {
    return this.routeWithReportId.snapshot.paramMap.get('reportId') ?? '';
  }

  /**
   * Returns the selected report instance id from the current summary route.
   */
  public get reportInstanceId(): string {
    return this.activatedRoute.snapshot.paramMap.get('reportInstanceId') ?? '';
  }
}
