import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StateService } from '@services';

export const ssoSignInGuard = (ssoRoute: boolean): CanActivateFn => {
  return () => {
    const ssoEnabled = inject(StateService).ssoEnabled;
    const router = inject(Router);

    if (ssoRoute && !ssoEnabled) {
      return router.createUrlTree([`/sign-in-stub`]);
    }

    if (!ssoRoute && ssoEnabled) {
      return router.createUrlTree([`/sign-in`]);
    }

    return true;
  };
};
