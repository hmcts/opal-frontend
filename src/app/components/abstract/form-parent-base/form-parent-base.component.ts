import { inject } from '@angular/core';
import { StateService } from '@services';
import { CanDeactivateType } from 'src/app/guards/can-deactivate/can-deactivate.guard';

export abstract class FormParentBaseComponent {
  public stateService = inject(StateService);
  public stateUnsavedChanges!: boolean;

  constructor() {}

  /**
   * If the user navigates externally from the site or closes the tab
   * Check if there is unsaved changes -> warning message
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
}
