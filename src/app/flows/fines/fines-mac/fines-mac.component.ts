import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FinesService } from '@services/fines/fines-service/fines.service';
import { FINES_MAC_STATE } from './constants/fines-mac-state';
import { CanDeactivateTypes } from '@guards/types/can-deactivate.type';
import { GlobalStore } from 'src/app/stores/global/global.store';

@Component({
  selector: 'app-fines-mac',

  imports: [RouterOutlet],
  templateUrl: './fines-mac.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacComponent implements OnDestroy {
  private readonly globalStore = inject(GlobalStore);
  protected readonly finesService = inject(FinesService);

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
    if (this.finesService.finesMacState.unsavedChanges) {
      return false;
    } else if (this.finesService.finesMacState.stateChanges) {
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
    if (this.finesService.finesMacState.stateChanges) {
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy(): void {
    // Cleanup our state when the route unloads...
    this.finesService.finesMacState = { ...FINES_MAC_STATE };
    this.finesService.finesMacState.offenceDetails = [];

    // Clear any errors...
    this.globalStore.setError({
      error: false,
      message: '',
    });
  }
}
