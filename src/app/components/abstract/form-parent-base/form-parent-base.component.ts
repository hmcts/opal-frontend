import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanDeactivateType } from '@interfaces';
import { MacStateService, StateService } from '@services';

export abstract class FormParentBaseComponent {
  private readonly router = inject(Router);
  public readonly stateService = inject(StateService);
  public readonly macStateService = inject(MacStateService);
  public stateUnsavedChanges!: boolean;

  /**
   * If the user navigates externally from the site or closes the tab
   * Check if there is unsaved changes form state -> warning message
   * Otherwise -> no warning message
   *
   * @returns boolean
   */
  canDeactivate(): CanDeactivateType {
    if (this.stateUnsavedChanges) {
      return false;
    } else {
      return true;
    }
  }

  protected routerNavigate(route: string): void {
    this.router.navigate([route]);
  }
}
