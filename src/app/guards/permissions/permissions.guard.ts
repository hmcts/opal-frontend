import { CanActivateFn } from '@angular/router';

export const permissionsGuard: CanActivateFn = (route, state) => {
  // Build the route path
  const parentUrl = route.parent?.url.join('/');
  const routeConfigPath = route.routeConfig?.path;
  const path = `${parentUrl}/${routeConfigPath}`;

  return true;
};
