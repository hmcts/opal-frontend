import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MANUAL_ACCOUNT_CREATION_STATE } from '@constants';
import { StateService } from '@services';
import { CanDeactivateType } from '@interfaces';
import { ManualAccountCreationRoutes } from '@enums';

@Component({
  selector: 'app-manual-account-creation',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './manual-account-creation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManualAccountCreationComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private stateService = inject(StateService);
  deactivateResult = new EventEmitter<boolean>();

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
   * Check if there is state changes but no unsaved changes -> warning message
   * Otherwise -> no warning message
   *
   * @returns boolean
   */
  canDeactivate(): CanDeactivateType {
    if (
      this.stateService.manualAccountCreation.stateChanges &&
      !this.stateService.manualAccountCreation.unsavedChanges &&
      !this.stateService.overrideExitPage
    ) {
      return false;
    } else {
      return true;
    }
  }

  protected routerNavigate(route: string): void {
    this.router.navigate([route]);
  }

  ngOnInit() {
    this.deactivateResult.subscribe((result: boolean) => {
      if (!result) {
        this.stateService.overrideExitPage = true;
        this.stateService.currentRoute = this.router.url;
        this.routerNavigate(ManualAccountCreationRoutes.exitPage);
      }
    });
  }

  ngOnDestroy(): void {
    // Cleanup our state when the route unloads...
    this.stateService.manualAccountCreation = MANUAL_ACCOUNT_CREATION_STATE;

    // Clear any errors...
    this.stateService.error.set({
      error: false,
      message: '',
    });

    this.stateService.overrideExitPage = false;
    this.deactivateResult.unsubscribe();
  }
}
