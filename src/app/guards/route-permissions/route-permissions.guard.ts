import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStateService } from '@services';

export const routePermissionsGuard = (routePermissionId: number | null): CanActivateFn => {
  return () => {
    const userStateService = inject(UserStateService);
    const router = inject(Router);

    console.log('routePermissionId 2', routePermissionId);

    // Get the unique permission ids for the user
    const uniquePermissionIds = userStateService.getUserUniquePermissions() || [];

    // If we don't have a permission id for the route, then we can't check for permissions
    // So allow the user to access the route
    if (!routePermissionId) {
      return true;
    }

    // If we don't have any unique permission ids, then we can't check for permissions
    if (uniquePermissionIds.length === 0) {
      return true;
    }

    // if we have a permission id for the route, then we need to check if the user has the permission
    console.log('uniquePermissionIds', uniquePermissionIds);
    if (!uniquePermissionIds.includes(routePermissionId)) {
      router.navigate(['access-denied']);
      return false;
    }

    return true;
  };
};

// export const routePermissionsGuard: CanActivateFn = () => {

//   return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
//     const userStateService = inject(UserStateService);
//     const router = inject(Router);
//     const parentUrl = route.parent?.url.join('/');
//     const routePath = route.routeConfig?.path;
//     const path = `${parentUrl ? parentUrl + '/' : ''}${routePath}`;

//     // Get the unique permission ids for the user
//     const uniquePermissionIds = userStateService.getUserUniquePermissions();

//     // Check if the route has a permission id
//     const routePermissionId = ROUTE_PERMISSIONS[path];

//     // If we don't have a permission id for the route, then we can't check for permissions
//     // So allow the user to access the route
//     if (!routePermissionId) {
//       return true;
//     }

//     // if we have a permission id for the route, then we need to check if the user has the permission
//     if (!uniquePermissionIds.includes(routePermissionId)) {
//       router.navigate(['access-denied']);
//       return false;
//     }

//     return true;
//   };
// };
