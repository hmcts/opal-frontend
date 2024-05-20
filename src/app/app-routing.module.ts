import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTE_PERMISSIONS } from '@constants';
import { authGuard, routePermissionsGuard } from '@guards';
import { RoutingPaths } from '@enums';
import { userStateResolver } from '@resolvers';
import { FlowExitStateGuard } from './guards/flow-exit-state-guard/flow-exit-state.guard';

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
        redirectTo: RoutingPaths.manualAccountCreationAccountDetails,
        pathMatch: 'full',
      },
      {
        path: RoutingPaths.manualAccountCreationAccountDetails,
        loadComponent: () =>
          import('./pages/manual-account-creation/account-details/account-details.component').then(
            (c) => c.AccountDetailsComponent,
          ),
        canActivate: [authGuard],
      },
      {
        path: RoutingPaths.manualAccountCreationCreateAccount,
        loadComponent: () =>
          import('./pages/manual-account-creation/create-account/create-account.component').then(
            (c) => c.CreateAccountComponent,
          ),
        canActivate: [authGuard],
      },
      {
        path: RoutingPaths.manualAccountCreationEmployerDetails,
        loadComponent: () =>
          import('./pages/manual-account-creation/employer-details/employer-details.component').then(
            (c) => c.EmployerDetailsComponent,
          ),
        canActivate: [authGuard],
        canDeactivate: [FlowExitStateGuard],
      },
      {
        path: RoutingPaths.manualAccountCreationEmployerDetails,
        loadComponent: () =>
          import('./pages/manual-account-creation/employer-details/employer-details-form/employer-details-form.component').then(
            (c) => c.EmployerDetailsFormComponent,
          ),
        canActivate: [authGuard],
        canDeactivate: [FlowExitStateGuard],
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
    resolve: { userState: userStateResolver },
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
