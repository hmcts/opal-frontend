import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { RoutingPaths } from '@enums';
import { PermissionsService, SessionService } from '@services';
import { catchError, map, of } from 'rxjs';

export const routePermissionsGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const permissionService = inject(PermissionsService);
  const sessionService = inject(SessionService);
  const router = inject(Router);

  return sessionService.getUserState().pipe(
    map((resp) => {
      const routePermissionId = route.data['routePermissionId'];

      // Get the unique permission ids for the user
      const uniquePermissionIds = permissionService.getUniquePermissions(resp) || [];

      // If we don't have a permission id for the route, or we don't have any unique permission ids, or the user doesn't have the required permission
      // then redirect the user to the access denied page
      if (!routePermissionId || uniquePermissionIds.length === 0 || !uniquePermissionIds.includes(routePermissionId)) {
        return router.createUrlTree([`/${RoutingPaths.accessDenied}`]);
      }

      return true;
    }),
    catchError(() => {
      return of(false);
    }),
  );
};
