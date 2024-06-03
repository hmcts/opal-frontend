import { ChangeDetectionStrategy, Component, HostListener, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MANUAL_ACCOUNT_CREATION_STATE } from '@constants';
import { StateService } from '@services';
import { CanDeactivateType } from '@interfaces';

@Component({
  selector: 'app-manual-account-creation',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './manual-account-creation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManualAccountCreationComponent implements OnDestroy {
  private readonly stateService = inject(StateService);

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
    if (this.stateService.manualAccountCreation.unsavedChanges) {
      return false;
    } else if (this.stateService.manualAccountCreation.stateChanges) {
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
    if (this.stateService.manualAccountCreation.stateChanges) {
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy(): void {
    // Cleanup our state when the route unloads...
    this.stateService.manualAccountCreation = MANUAL_ACCOUNT_CREATION_STATE;

    // Clear any errors...
    this.stateService.error.set({
      error: false,
      message: '',
    });
  }
}
