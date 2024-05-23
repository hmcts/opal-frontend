import { CanDeactivateFn, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export type CanDeactivateType = Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;

export interface CanComponentDeactivate {
  canDeactivate: () => CanDeactivateType;
}

export const canDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (component: CanComponentDeactivate) => {
  return component.canDeactivate()
    ? true
    : confirm(
        'WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.',
      );
};
