import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesSuspenseItemStore } from './stores/fines-suspense-item.store';

@Component({
  selector: 'app-fines-suspense-item',
  imports: [RouterOutlet],
  template: '<router-outlet />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSuspenseItemComponent implements OnDestroy {
  private readonly opalFines = inject(OpalFines);
  private readonly store = inject(FinesSuspenseItemStore);

  /** Keep state between Suspense pages, but clear it when the whole journey is left. */
  public ngOnDestroy(): void {
    this.opalFines.clearCache('suspenseItemSummaryCache$');
    this.opalFines.clearCache('suspenseItemHistoryCache$');
    this.store.resetStore();
  }
}
