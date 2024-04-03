import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTE_PERMISSIONS } from '@constants';
import { authGuard, routePermissionsGuard } from '@guards';
import { RoutingPaths } from '@enums';
import { signedInGuard } from '@guards';

const routes: Routes = [
  { path: '', redirectTo: 'test-page', pathMatch: 'full' },

  {
    path: 'test-page',
    loadComponent: () => import('./pages/test-page/test-page.component').then((c) => c.TestPageComponent),
    canActivate: [authGuard],
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
    canActivate: [authGuard, routePermissionsGuard(ROUTE_PERMISSIONS[RoutingPaths.accountEnquiry])],
  },
  {
    path: RoutingPaths.accessDenied,
    loadComponent: () => import('./pages/access-denied/access-denied.component').then((c) => c.AccessDeniedComponent),
    canActivate: [authGuard],
  },
  {
    path: RoutingPaths.signIn,
    loadComponent: () => import('./pages/sign-in/sign-in.component').then((c) => c.SignInComponent),
    canActivate: [signedInGuard],
  },
];

// initialNavigation: 'disabled' is set (was enabledBlocking) to prevent the router from navigating before the root component is created...
// As we need our app to bootstrap first, to trigger the app_initializer service, which sets the roles...
// This is because the roles are needed to determine the permissions for the routes...
// Routing initialised in app.component.ts
// https://github.com/angular/angular/issues/14588#issuecomment-281744906
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'disabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
