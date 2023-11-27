import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services';
import { map, catchError, of } from 'rxjs';

export const signinedInGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router = inject(Router);
  return authService.checkAuthenticated().pipe(
    map(() => {
      router.navigate(['/']);
      return false;
    }),
    catchError(() => {
      return of(true);
    }),
  );
};
