import { Routes } from '@angular/router';
import { authGuard, signedInGuard } from '@guards';
import { RoutingPaths } from '@enums';
import { userStateResolver } from '@resolvers';

export const routing: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: RoutingPaths.dashboard,
    loadComponent: () => import('../dashboard/dashboard.component').then((c) => c.DashboardComponent),
    canActivate: [authGuard],
    resolve: { userState: userStateResolver },
  },
  {
    path: RoutingPaths.accessDenied,
    loadComponent: () => import('../access-denied/access-denied.component').then((c) => c.AccessDeniedComponent),
    canActivate: [authGuard],
    resolve: { userState: userStateResolver },
  },
  {
    path: RoutingPaths.signIn,
    loadComponent: () => import('../sign-in/sign-in.component').then((c) => c.SignInComponent),
    canActivate: [signedInGuard],
  },
];
