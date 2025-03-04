import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CanDeactivateTypes } from '@guards/types/can-deactivate.type';
import { GlobalStore } from 'src/app/stores/global/global.store';
import { FinesMacStore } from './stores/fines-mac.store';

@Component({
  selector: 'app-fines-mac',
  imports: [RouterOutlet],
  templateUrl: './fines-mac.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacComponent implements OnDestroy {
  private readonly globalStore = inject(GlobalStore);
  private readonly finesMacStore = inject(FinesMacStore);

  /**
   * If the user navigates externally from the site or closes the tab
   * Check if there is unsaved changes -> warning message
   * Check if the state has changes -> warning message
   * Otherwise -> no warning message
   *
   * @returns boolean
   */
  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(): boolean {
    if (this.finesMacStore.unsavedChanges()) {
      return false;
    } else if (this.finesMacStore.stateChanges()) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * If the user navigates externally from the site or closes the tab
   * Check if there is state changes -> warning message
   * Otherwise -> no warning message
   *
   * @returns boolean
   */
  canDeactivate(): CanDeactivateTypes {
    if (this.finesMacStore.stateChanges()) {
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy(): void {
    // Cleanup our state when the route unloads...
    this.finesMacStore.resetFinesMacStore();

    // Clear any errors...
    this.globalStore.setError({
      error: false,
      message: '',
    });
  }
}
