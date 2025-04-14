import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map, catchError, of } from 'rxjs';
import { AuthService } from '@services/auth-service/auth.service';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';
import { GlobalStoreType } from '@stores/global/types/global-store.type';
import { GlobalStore } from '@stores/global/global.store';
import { SSO_ENDPOINTS } from '@routing/constants/sso-endpoints.constant';

/**
 * A guard that checks if the user is authenticated before allowing access to a route.
 * @returns An Observable that emits a boolean value indicating whether the user is authenticated.
 */
export const authGuard: CanActivateFn = () => {
  const authService: AuthService = inject(AuthService);
  const globalStore: GlobalStoreType = inject(GlobalStore);
  const router = inject(Router);

  return authService.checkAuthenticated().pipe(
    map((resp) => {
      return resp;
    }),
    catchError(() => {
      if (globalStore.ssoEnabled()) {
        window.location.href = SSO_ENDPOINTS.login;
      } else {
        router.navigate([PAGES_ROUTING_PATHS.children.signIn]);
      }
      return of(false);
    }),
  );
};
