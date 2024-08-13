import { CanDeactivateFn } from '@angular/router';
import { ICanDeactivateCanComponentDeactivate } from '@interfaces';

export const canDeactivateGuard: CanDeactivateFn<ICanDeactivateCanComponentDeactivate> = (component: ICanDeactivateCanComponentDeactivate) => {
  return component.canDeactivate()
    ? true
    : confirm(
        'WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.',
      );
};
