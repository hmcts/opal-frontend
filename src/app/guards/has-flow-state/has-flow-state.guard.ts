import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

export function hasFlowStateGuard<T>(
  getState: () => T,
  checkCondition: (state: T) => boolean,
  getNavigationPath: () => string,
): CanActivateFn {
  return (route: ActivatedRouteSnapshot) => {
    const router = inject(Router);
    const state = getState();
    const { queryParams, fragment } = route;

    return checkCondition(state)
      ? true
      : router.createUrlTree([getNavigationPath()], {
          queryParams: queryParams ?? undefined,
          fragment: fragment ?? undefined,
        });
  };
}
