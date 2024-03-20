import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoutingPaths } from '@enums';
import { UserStateService } from '@services';

/**
 * Returns a route permissions guard function that checks if the user has the required permission to access a route.
 * @param routePermissionId - The permission ID required for the route.
 * @returns A function that can be used as a route guard.
 */
export const routePermissionsGuard = (routePermissionId: number | null): CanActivateFn => {
  return () => {
    const userStateService = inject(UserStateService);
    const router = inject(Router);

    // Get the unique permission ids for the user
    const uniquePermissionIds = userStateService.getUserUniquePermissions() || [];

    // If we don't have a permission id for the route, or we don't have any unique permission ids, then we can't check for permissions
    // So allow the user to access the route
    if (!routePermissionId || uniquePermissionIds.length === 0) {
      return true;
    }
    // if we have a permission id for the route, then we need to check if the user has the permission

    if (!uniquePermissionIds.includes(routePermissionId)) {
      return router.createUrlTree([`/${RoutingPaths.accessDenied}`]);
    }

    return true;
  };
};
