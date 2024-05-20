import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTE_PERMISSIONS } from '@constants';
import { authGuard, routePermissionsGuard, signedInGuard } from '@guards';
import { RoutingPaths } from '@enums';
import { userStateResolver } from '@resolvers';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: RoutingPaths.dashboard,
    loadComponent: () => import('./pages/dashboard/dashboard.component').then((c) => c.DashboardComponent),
    canActivate: [authGuard],
    resolve: { userState: userStateResolver },
  },
  {
    path: RoutingPaths.accountEnquiry,
    loadComponent: () =>
      import('./pages/account-enquiry/account-enquiry.component').then((c) => c.AccountEnquiryComponent),
    children: [
      {
        path: '',
        redirectTo: RoutingPaths.accountEnquirySearch,
        pathMatch: 'full',
      },
      {
        path: RoutingPaths.accountEnquirySearch,
        loadComponent: () => import('./pages/account-enquiry/search/search.component').then((c) => c.SearchComponent),
        canActivate: [authGuard],
      },

      {
        path: RoutingPaths.accountEnquiryMatches,
        loadComponent: () =>
          import('./pages/account-enquiry/matches/matches.component').then((c) => c.MatchesComponent),
        canActivate: [authGuard],
      },

      {
        path: RoutingPaths.accountEnquiryDetails,
        loadComponent: () =>
          import('./pages/account-enquiry/details/details.component').then((c) => c.DetailsComponent),
        canActivate: [authGuard],
      },
    ],
    canActivate: [authGuard, routePermissionsGuard],
    data: { routePermissionId: ROUTE_PERMISSIONS[RoutingPaths.accountEnquiry] },
    resolve: { userState: userStateResolver },
  },
  {
    path: RoutingPaths.manualAccountCreation,
    loadComponent: () =>
      import('./pages/manual-account-creation/manual-account-creation.component').then(
        (c) => c.ManualAccountCreationComponent,
      ),
    children: [
      {
        path: '',
        redirectTo: RoutingPaths.manualAccountCreation,
        pathMatch: 'full',
      },
    ],
    resolve: { userState: userStateResolver },
  },
  {
    path: RoutingPaths.accessDenied,
    loadComponent: () => import('./pages/access-denied/access-denied.component').then((c) => c.AccessDeniedComponent),
    canActivate: [authGuard],
    resolve: { userState: userStateResolver },
  },
  {
    path: RoutingPaths.signIn,
    loadComponent: () => import('./pages/sign-in/sign-in.component').then((c) => c.SignInComponent),
    canActivate: [signedInGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
