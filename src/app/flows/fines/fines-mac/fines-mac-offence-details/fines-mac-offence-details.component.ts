import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FinesMacOffenceDetailsService } from './services/fines-mac-offence-details-service/fines-mac-offence-details.service';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE } from './constants/fines-mac-offence-details-draft-state.constant';
import { CanDeactivateTypes } from '@guards/types/can-deactivate.type';
import { GlobalStore } from 'src/app/stores/global/global.store';
import { FinesMacStore } from '../stores/fines-mac.store';

@Component({
  selector: 'app-fines-mac-offence-details',
  imports: [RouterOutlet],
  templateUrl: './fines-mac-offence-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacOffenceDetailsComponent implements OnDestroy {
  private readonly globalStore = inject(GlobalStore);
  public finesMacStore = inject(FinesMacStore);
  protected readonly finesMacOffenceDetailsService = inject(FinesMacOffenceDetailsService);

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
    this.finesMacOffenceDetailsService.finesMacOffenceDetailsDraftState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE;

    // Clear any errors...
    this.globalStore.setError({
      error: false,
      message: '',
    });
  }
}
