import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from './constants/fines-reports-summary-list-report-configuration.constant';

@Component({
  selector: 'app-fines-reports-summary-list',
  imports: [ReactiveFormsModule],
  templateUrl: './fines-reports-summary-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesReportsSummaryListComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly routeWithReportTypeId = this.activatedRoute.parent ?? this.activatedRoute;
  private readonly reportTypeId = toSignal(
    this.routeWithReportTypeId.paramMap.pipe(map((paramMap) => paramMap.get('reportTypeId') ?? '')),
    {
      initialValue: this.routeWithReportTypeId.snapshot.paramMap.get('reportTypeId') ?? '',
    },
  );

  public get pageHeading(): string {
    return (
      FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((config) => config.id === this.reportTypeId())?.heading ?? ''
    );
  }
}
