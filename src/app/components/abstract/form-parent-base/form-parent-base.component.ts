import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanDeactivateType } from '@interfaces';
import { AeStateService, GlobalStateService, MacStateService } from '@services';
import { FinesService } from 'src/app/fines/services/fines-service/fines.service';

export abstract class FormParentBaseComponent {
  private readonly router = inject(Router);
  public readonly globalStateService = inject(GlobalStateService);
  public readonly macStateService = inject(MacStateService);
  public readonly aeStateService = inject(AeStateService);
  public readonly finesService = inject(FinesService);
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
