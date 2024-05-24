import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanDeactivateType } from '@interfaces';
import { StateService } from '@services';

export abstract class FormParentBaseComponent {
  private readonly router = inject(Router);
  public stateService = inject(StateService);
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

  private routerNavigate(route: string): void {
    this.router.navigate([route]);
  }
}
