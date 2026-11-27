import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FinesSuspenseItemStore } from './stores/fines-suspense-item.store';

@Component({
  selector: 'app-fines-suspense-item',
  imports: [RouterOutlet],
  templateUrl: './fines-suspense-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:beforeunload)': 'handleBeforeUnload()',
  },
})
export class FinesSuspenseItemComponent implements OnDestroy {
  private readonly opalFines = inject(OpalFines);
  private readonly store = inject(FinesSuspenseItemStore);

  /** Browser refresh and close would lose unsaved edits and the retained business unit. */
  public handleBeforeUnload(): boolean {
    return !this.store.unsavedChanges() && this.store.selectedBusinessUnitId() === null;
  }

  /** Keep state between Suspense pages, but clear it when the whole journey is left. */
  public ngOnDestroy(): void {
    this.opalFines.clearCache('suspenseItemSummaryCache$');
    this.store.resetStore();
  }
}
