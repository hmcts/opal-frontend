import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CanDeactivateType } from '@interfaces';
import { GlobalStateService } from '@services';
import { FinesService } from '@services/fines';
import { FINES_MAC_STATE } from './constants/fines-mac-state';

@Component({
  selector: 'app-fines-mac',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './fines-mac.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinesMacComponent implements OnDestroy {
  private readonly globalStateService = inject(GlobalStateService);
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
  canDeactivate(): CanDeactivateType {
    if (this.finesService.finesMacState.stateChanges) {
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy(): void {
    // Cleanup our state when the route unloads...
    this.finesService.finesMacState = FINES_MAC_STATE;

    // Clear any errors...
    this.globalStateService.error.set({
      error: false,
      message: '',
    });
  }
}
