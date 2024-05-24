import { CanDeactivateFn } from '@angular/router';
import { CanComponentDeactivate } from '@interfaces';

export const canDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (component: CanComponentDeactivate) => {
  return component.canDeactivate()
    ? true
    : confirm(
        'WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.',
      );
};
