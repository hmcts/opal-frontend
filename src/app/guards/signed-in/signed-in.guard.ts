import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@services';
import { map, catchError, of } from 'rxjs';

export const signedInGuard: CanActivateFn = () => {
  const authService: AuthService = inject(AuthService);
  const router = inject(Router);
  return authService.checkAuthenticated().pipe(
    map(() => {
      // Redirect to default route if signed in...
      router.navigate(['/']);
      return false;
    }),
    catchError(() => {
      return of(true);
    }),
  );
};
