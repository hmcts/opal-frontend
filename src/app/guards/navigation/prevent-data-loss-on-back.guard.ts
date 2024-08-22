import { CanDeactivateFn } from '@angular/router';
import { IPreventDataLossOnBack } from './interfaces';

export const preventDataLossOnBackGuard: CanDeactivateFn<IPreventDataLossOnBack> = (
  component: IPreventDataLossOnBack,
) => {
  if (component.preventDataLossOnBackGuard()) {
    return confirm(
      'WARNING: Navigating back will wipe your data. Press Cancel to stay on this page, or OK to proceed and lose your data.',
    );
  }
  return true;
};
