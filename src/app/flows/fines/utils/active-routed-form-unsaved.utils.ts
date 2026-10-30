import { RouterOutlet } from '@angular/router';
import { AbstractFormParentBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-parent-base';

/** Checks whether the page currently shown by a flow outlet has unsaved form edits. */
export function activeRoutedFormHasUnsavedChanges(routerOutlet?: RouterOutlet): boolean {
  const activePage = routerOutlet?.isActivated ? routerOutlet.component : null;
  return activePage instanceof AbstractFormParentBaseComponent && activePage.stateUnsavedChanges;
}
