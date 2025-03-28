import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CanDeactivateTypes } from '@hmcts/opal-frontend-common/types';

export abstract class AbstractFormParentBaseComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  public stateUnsavedChanges!: boolean;

  /**
   * If the user navigates externally from the site or closes the tab
   * Check if there is unsaved changes form state -> warning message
   * Otherwise -> no warning message
   *
   * @returns boolean
   */
  canDeactivate(): CanDeactivateTypes {
    if (this.stateUnsavedChanges) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Navigates to the specified route using the Angular router.
   *
   * @param route - The route to navigate to.
   */
  protected routerNavigate(route: string, nonRelative: boolean = false, event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    if (nonRelative) {
      this.router.navigate([route]);
    } else {
      this.router.navigate([route], { relativeTo: this.activatedRoute.parent });
    }
  }

  /**
   * Checks if an object has any non-empty values.
   *
   * @param form - The object representing form data with key-value pairs.
   * @returns A boolean indicating whether the object has any non-empty values.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected hasFormValues(form: { [key: string]: any }): boolean {
    return Object.values(form).some(Boolean);
  }
}
