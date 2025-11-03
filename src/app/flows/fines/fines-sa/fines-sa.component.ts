import { ChangeDetectionStrategy, Component, HostListener, inject, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesSaStore } from './stores/fines-sa.store';

@Component({
  selector: 'app-fines-sa',
  imports: [RouterOutlet],
  templateUrl: './fines-sa.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesSaComponent implements OnDestroy {
  private readonly globalStore = inject(GlobalStore);
  private readonly finesSaStore = inject(FinesSaStore);

  /**
   * If the user navigates externally from the site or closes the tab
   * Check if there is unsaved changes -> warning message
   * Check if the state has changes -> warning message
   * Otherwise -> no warning message
   *
   * @returns boolean
   */
  @HostListener('window:beforeunload', ['$event'])
  public handleBeforeUnload(): boolean {
    if (this.finesSaStore.unsavedChanges()) {
      return false;
    } else if (this.finesSaStore.stateChanges()) {
      return false;
    } else {
      return true;
    }
  }

  public ngOnDestroy(): void {
    // Cleanup our state when the route unloads...
    this.finesSaStore.resetStore();

    // Clear any errors...
    this.globalStore.resetError();
  }
}
