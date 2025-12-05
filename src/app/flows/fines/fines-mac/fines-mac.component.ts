import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FinesMacStore } from './stores/fines-mac.store';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { CanDeactivateTypes } from '@hmcts/opal-frontend-common/guards/can-deactivate/types';
import { OpalFines } from '../services/opal-fines-service/opal-fines.service';
@Component({
  selector: 'app-fines-mac',
  imports: [RouterOutlet],
  templateUrl: './fines-mac.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacComponent implements OnDestroy {
  private readonly globalStore = inject(GlobalStore);
  private readonly finesMacStore = inject(FinesMacStore);
  private readonly opalFines = inject(OpalFines);

  /**
   * If the user navigates externally from the site or closes the tab
   * Check if there is unsaved changes -> warning message
   * Check if the state has changes -> warning message
   * Otherwise -> no warning message
   *
   * @returns boolean
   */
  @HostListener('window:beforeunload')
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

  public ngOnDestroy(): void {
    // Cleanup our state when the route unloads...
    this.finesMacStore.resetStore();
    this.opalFines.clearDraftAccountsCache();

    // Clear any errors...
    this.globalStore.resetBannerError();
  }
}
