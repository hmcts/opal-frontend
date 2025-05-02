import { ChangeDetectionStrategy, Component, HostListener, inject, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { FinesMacOffenceDetailsSearchOffencesStore } from './stores/fines-mac-offence-details-search-offences.store';
import { CanDeactivateTypes } from '@hmcts/opal-frontend-common/guards/can-deactivate/types';

@Component({
  selector: 'app-fines-mac-offence-details-search-offences',
  imports: [RouterOutlet],
  providers: [FinesMacOffenceDetailsSearchOffencesStore],
  templateUrl: './fines-mac-offence-details-search-offences.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsSearchOffencesComponent implements OnDestroy {
  private readonly globalStore = inject(GlobalStore);
  private readonly finesMacOffenceDetailsSearchOffencesStore = inject(FinesMacOffenceDetailsSearchOffencesStore);

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
    if (this.finesMacOffenceDetailsSearchOffencesStore.unsavedChanges()) {
      return false;
    } else if (this.finesMacOffenceDetailsSearchOffencesStore.stateChanges()) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Checks if the component can be deactivated.
   * @returns A boolean indicating whether the component can be deactivated.
   */
  canDeactivate(): CanDeactivateTypes {
    if (this.finesMacOffenceDetailsSearchOffencesStore.stateChanges()) {
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy(): void {
    // Cleanup our state when the route unloads...
    this.finesMacOffenceDetailsSearchOffencesStore.resetSearchOffencesStore();

    // Clear any errors...
    this.globalStore.setError({
      error: false,
      message: '',
    });
  }
}
