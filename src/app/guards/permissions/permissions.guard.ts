import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ROUTE_PERMISSIONS } from '@constants';
import { UserStateService } from '@services';

export const permissionsGuard: CanActivateFn = (route) => {
  const userStateService = inject(UserStateService);
  const router = inject(Router);
  const parentUrl = route.parent?.url.join('/');
  const routePath = route.routeConfig?.path;
  const path = `${parentUrl ? parentUrl + '/' : ''}${routePath}`;

  // Get the unique permission ids for the user
  const uniquePermissionIds = userStateService.getUserUniquePermissions();

  // Check if the route has a permission id
  const routePermissionId = ROUTE_PERMISSIONS[path];

  // If we don't have a permission id for the route, then we can't check for permissions
  // So allow the user to access the route
  if (!routePermissionId) {
    return true;
  }

  // if we have a permission id for the route, then we need to check if the user has the permission
  if (!uniquePermissionIds.includes(routePermissionId)) {
    router.navigate(['access-denied']);
    return false;
  }

  return true;
};
