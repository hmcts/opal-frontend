import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CanDeactivateTypes } from '@guards/types/can-deactivate.type';
import { GlobalStore } from 'src/app/stores/global/global.store';
import { FinesMacStore } from '../stores/fines-mac.store';
import { FinesMacOffenceDetailsStore } from './stores/fines-mac-offence-details.store';

@Component({
  selector: 'app-fines-mac-offence-details',
  imports: [RouterOutlet],
  templateUrl: './fines-mac-offence-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsComponent implements OnDestroy {
  private readonly globalStore = inject(GlobalStore);
  public finesMacStore = inject(FinesMacStore);
  public finesMacOffenceDetailsStore = inject(FinesMacOffenceDetailsStore);

  /**
   * Checks if the component can be deactivated.
   * @returns A boolean indicating whether the component can be deactivated.
   */
  canDeactivate(): CanDeactivateTypes {
    if (this.finesMacStore.unsavedChanges()) {
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy(): void {
    // Cleanup our state when the route unloads...
    this.finesMacOffenceDetailsStore.resetStoreDraftImpositionMinor();

    // Clear any errors...
    this.globalStore.setError({
      error: false,
      message: '',
    });
  }
}
