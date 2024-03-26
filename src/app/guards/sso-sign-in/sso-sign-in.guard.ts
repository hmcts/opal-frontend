import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoutingPaths } from '@enums';
import { StateService } from '@services';

export const ssoSignInGuard = (ssoRoute: boolean): CanActivateFn => {
  return () => {
    const ssoEnabled = inject(StateService).ssoEnabled;
    const router = inject(Router);

    // If it's an SSO route, and SSO is not enabled then go to the sign in stub
    if (ssoRoute && !ssoEnabled) {
      return router.createUrlTree([`/${RoutingPaths.signInStub}`]);
    }

    // If it's not an SSO route, and SSO is enabled then go to the sign in page
    if (!ssoRoute && ssoEnabled) {
      return router.createUrlTree([`/${RoutingPaths.signIn}`]);
    }

    return true;
  };
};
