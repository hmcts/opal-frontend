import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTE_PERMISSIONS } from '@constants';
import { authGuard, routePermissionsGuard, signedInGuard } from '@guards';
import { RoutingPaths } from './enums/routing-paths';

const routes: Routes = [
  { path: '', redirectTo: 'account-enquiry/search', pathMatch: 'full' },

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
    path: 'access-denied',
    loadComponent: () => import('./pages/access-denied/access-denied.component').then((c) => c.AccessDeniedComponent),
    canActivate: [authGuard],
  },
  {
    path: 'sign-in',
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
