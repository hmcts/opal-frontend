import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map, catchError, of } from 'rxjs';
import { AuthService, StateService } from '@services';

/**
 * A guard that checks if the user is authenticated before allowing access to a route.
 * @returns An Observable that emits a boolean value indicating whether the user is authenticated.
 */
export const authGuard: CanActivateFn = () => {
  const authService: AuthService = inject(AuthService);
  const ssoEnabled = inject(StateService).ssoEnabled;
  const router = inject(Router);
  return authService.checkAuthenticated().pipe(
    map((resp) => {
      return resp;
    }),
    catchError(() => {
      const route = ssoEnabled ? ['sign-in'] : ['sign-in-stub'];

      router.navigate(route);
      return of(false);
    }),
  );
};
