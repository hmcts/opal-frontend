import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FinesReportsSummaryListStore } from './fines-reports-summary-list/stores/fines-reports-summary-list.store';

@Component({
  selector: 'app-fines-reports',
  imports: [RouterOutlet],
  templateUrl: './fines-reports.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesReportsComponent implements OnDestroy {
  private readonly finesReportsSummaryListStore = inject(FinesReportsSummaryListStore);

  /**
   * Resets report summary list filters when the reports flow is destroyed.
   */
  public ngOnDestroy(): void {
    this.finesReportsSummaryListStore.resetFilters();
  }
}
