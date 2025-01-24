import { Routes } from '@angular/router';
import { authGuard } from '@guards/auth/auth.guard';
import { signedInGuard } from '@guards/signed-in/signed-in.guard';
import { RoutingPaths } from '@routing/enums/routing-paths';
import { userStateResolver } from '@resolvers/user-state/user-state.resolver';
import { TitleResolver } from '@resolvers/title/title.resolver';

export const routing: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: RoutingPaths.dashboard,
    loadComponent: () => import('../dashboard/dashboard.component').then((c) => c.DashboardComponent),
    canActivate: [authGuard],
    data: { title: 'Dashboard' },
    resolve: { userState: userStateResolver, title: TitleResolver },
  },
  {
    path: RoutingPaths.accessDenied,
    loadComponent: () => import('../access-denied/access-denied.component').then((c) => c.AccessDeniedComponent),
    canActivate: [authGuard],
    data: { title: 'Access denied' },
    resolve: { userState: userStateResolver, title: TitleResolver },
  },
  {
    path: RoutingPaths.signIn,
    loadComponent: () => import('../sign-in/sign-in.component').then((c) => c.SignInComponent),
    canActivate: [signedInGuard],
    data: { title: 'Sign in' },
    resolve: { title: TitleResolver },
  },
];
