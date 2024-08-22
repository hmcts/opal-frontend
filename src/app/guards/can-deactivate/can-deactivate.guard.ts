import { CanDeactivateFn } from '@angular/router';
import { ICanDeactivateCanComponentDeactivate } from '@interfaces';

export const canDeactivateGuard: CanDeactivateFn<ICanDeactivateCanComponentDeactivate> = (
  component: ICanDeactivateCanComponentDeactivate,
) => {
  return component.canDeactivate()
    ? true
    : confirm(
        'WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.',
      );
};

export const preventBackNavigationGuard: CanDeactivateFn<ICanDeactivateCanComponentDeactivate> = (
  component: ICanDeactivateCanComponentDeactivate,
  currentRoute,
  currentState,
  nextState,
) => {
  if (component.showWarningOnBack()) {
    const navigatingBack = nextState.url !== currentState.url;

    if (navigatingBack) {
      return confirm(
        'WARNING: Navigating back will wipe your data. Press Cancel to stay on this page, or OK to proceed and lose your data.',
      );
    }
  }
  return true;
};
