import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map, catchError, of } from 'rxjs';
import { AuthService } from '@services/auth-service/auth.service';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';

/**
 * A guard that checks if the user is authenticated before allowing access to a route.
 * @returns An Observable that emits a boolean value indicating whether the user is authenticated.
 */
export const authGuard: CanActivateFn = () => {
  const authService: AuthService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuthenticated().pipe(
    map((resp) => {
      return resp;
    }),
    catchError(() => {
      router.navigate([PAGES_ROUTING_PATHS.children.signIn]);
      return of(false);
    }),
  );
};
