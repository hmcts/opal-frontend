import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ROUTE_PERMISSIONS } from '@constants';
import { UserStateService } from '@services';

export const permissionsGuard: CanActivateFn = (route, state) => {
  const userStateService = inject(UserStateService);
  const router = inject(Router);
  // Build the route path
  const parentUrl = route.parent?.url.join('/');
  const routeConfigPath = route.routeConfig?.path;
  const path = `${parentUrl}/${routeConfigPath}`;

  console.log('permissionsGuard: path', path);

  // Get the unique permission ids for the user
  const uniquePermissionIds = userStateService.getUserUniquePermissions();

  console.log('permissionsGuard: uniquePermissionIds', uniquePermissionIds);

  // Check if the route has a permission id
  const routePermissionId = ROUTE_PERMISSIONS[path];
  console.log('permissionsGuard: routePermissionId', routePermissionId);
  // if we don't have a permission id for the route, then we can't check for permissions
  if (!routePermissionId) {
    console.log('permissionsGuard: no routePermissionId');
    return true;
  }

  // if we have a permission id for the route, then we need to check if the user has the permission
  if (!uniquePermissionIds.includes(routePermissionId)) {
    router.navigate(['access-denied']);
    return false;
  }

  return true;
};
