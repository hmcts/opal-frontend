import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, ViewChild, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FinesReportsSummaryListStore } from './fines-reports-summary-list/stores/fines-reports-summary-list.store';
import { activeRoutedFormHasUnsavedChanges } from '../utils/active-routed-form-unsaved.utils';

@Component({
  selector: 'app-fines-reports',
  imports: [RouterOutlet],
  templateUrl: './fines-reports.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesReportsComponent implements OnDestroy {
  @ViewChild(RouterOutlet) private readonly routerOutlet?: RouterOutlet;

  private readonly finesReportsSummaryListStore = inject(FinesReportsSummaryListStore);

  @HostListener('window:beforeunload')
  public handleBeforeUnload(): boolean {
    return !activeRoutedFormHasUnsavedChanges(this.routerOutlet);
  }

  /**
   * Resets report summary list filters when the reports flow is destroyed.
   */
  public ngOnDestroy(): void {
    this.finesReportsSummaryListStore.resetFilters();
  }
}
