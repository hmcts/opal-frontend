import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, StateService } from '@services';
import { map, catchError, of } from 'rxjs';

/**
 * A guard that checks if the user is signed in.
 * If the user is signed in, it redirects to the default route.
 * If the user is not signed in, it allows access to the route.
 * @returns An Observable<boolean> indicating whether the user is signed in or not.
 */
export const signedInGuard: CanActivateFn = () => {
  const authService: AuthService = inject(AuthService);
  const stateService = inject(StateService);
  const document = inject(DOCUMENT);
  const router = inject(Router);

  return authService.checkAuthenticated().pipe(
    map(() => {
      // If we have a user state then redirect as normal
      if (stateService.userState) {
        return router.createUrlTree(['/']);
      } else {
        // if we don't the user has used the back button in the browser after initial login...
        // So we need to update the transfer state cache (ng-state in the dom) as they will load an old version of the page...
        // This will cause the page to reload and set the updated ng-state and the user to be redirected to the default route...
        document.location.href = '/';
        return false;
      }
    }),
    catchError(() => {
      return of(true);
    }),
  );
};
