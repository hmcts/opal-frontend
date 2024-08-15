import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CanDeactivateCanDeactivateType } from '@interfaces';
import { GlobalStateService } from '@services';

export abstract class AbstractFormParentBaseComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  public readonly globalStateService = inject(GlobalStateService);

  public stateUnsavedChanges!: boolean;

  /**
   * If the user navigates externally from the site or closes the tab
   * Check if there is unsaved changes form state -> warning message
   * Otherwise -> no warning message
   *
   * @returns boolean
   */
  canDeactivate(): CanDeactivateCanDeactivateType {
    if (this.stateUnsavedChanges) {
      return false;
    } else {
      return true;
    }
  }

  protected routerNavigate(route: string): void {
    this.router.navigate([route], { relativeTo: this.activatedRoute.parent });
  }
}