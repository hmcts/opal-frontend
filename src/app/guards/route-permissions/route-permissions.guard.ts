import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoutingPaths } from '@enums';
import { PermissionsService, StateService } from '@services';

/**
 * Returns a route permissions guard function that checks if the user has the required permission to access a route.
 * @param routePermissionId - The permission ID required for the route.
 * @returns A function that can be used as a route guard.
 */
export const routePermissionsGuard = (routePermissionId: number | null): CanActivateFn => {
  return () => {
    const stateService = inject(StateService);
    const permissionService = inject(PermissionsService);
    const router = inject(Router);

    // Get the unique permission ids for the user
    const uniquePermissionIds = permissionService.getUniquePermissions(stateService.userState) || [];

    // If we don't have a permission id for the route, or we don't have any unique permission ids, or the user doesn't have the required permission
    // then redirect the user to the access denied page
    if (!routePermissionId || uniquePermissionIds.length === 0 || !uniquePermissionIds.includes(routePermissionId)) {
      return router.createUrlTree([`/${RoutingPaths.accessDenied}`]);
    }

    return true;
  };
};
