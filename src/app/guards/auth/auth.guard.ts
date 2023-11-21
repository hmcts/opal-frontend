import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { map, catchError, of } from 'rxjs';
import { AuthService } from '@services';

export const authGuard: CanActivateFn = () => {
  const authService: AuthService = inject(AuthService);
  // const router = inject(Router);
  return authService.checkAuthenticated().pipe(
    map((resp) => {
      return resp;
    }),
    catchError(() => {
      // router.navigate(['route-to-fallback-page']);
      return of(false);
    }),
  );
};
