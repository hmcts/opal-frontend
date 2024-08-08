import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, canDeactivateGuard } from '@guards';
import { RoutingPaths } from '@enums';
import { userStateResolver } from '@resolvers';
import { routing as pagesRouting } from '@routing/pages';
import { routing as flowsRouting } from '@routing/flows';

const routes: Routes = [
  ...pagesRouting,
  ...flowsRouting,
  {
    path: RoutingPaths.manualAccountCreation,
    loadComponent: () =>
      import('./pages/manual-account-creation/manual-account-creation.component').then(
        (c) => c.ManualAccountCreationComponent,
      ),
    children: [
      {
        path: '',
        redirectTo: RoutingPaths.manualAccountCreationCreateAccount,

        pathMatch: 'full',
      },
      {
        path: RoutingPaths.manualAccountCreationCreateAccount,
        loadComponent: () =>
          import('./pages/manual-account-creation/create-account/create-account.component').then(
            (c) => c.CreateAccountComponent,
          ),
        canActivate: [authGuard],
        canDeactivate: [canDeactivateGuard],
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
        path: RoutingPaths.manualAccountCreationEmployerDetails,
        loadComponent: () =>
          import('./pages/manual-account-creation/employer-details/employer-details.component').then(
            (c) => c.EmployerDetailsComponent,
          ),
        canActivate: [authGuard],
        canDeactivate: [canDeactivateGuard],
      },
      {
        path: RoutingPaths.manualAccountCreationContactDetails,
        loadComponent: () =>
          import('./pages/manual-account-creation/contact-details/contact-details.component').then(
            (c) => c.ContactDetailsComponent,
          ),
        canActivate: [authGuard],
        canDeactivate: [canDeactivateGuard],
      },
      {
        path: RoutingPaths.manualAccountCreationParentGuardianDetails,
        loadComponent: () =>
          import('./pages/manual-account-creation/parent-guardian-details/parent-guardian-details.component').then(
            (c) => c.ParentGuardianDetailsComponent,
          ),
        canActivate: [authGuard],
        canDeactivate: [canDeactivateGuard],
      },
      {
        path: RoutingPaths.manualAccountCreationPersonalDetails,
        loadComponent: () =>
          import('./pages/manual-account-creation/personal-details/personal-details.component').then(
            (c) => c.PersonalDetailsComponent,
          ),
        canActivate: [authGuard],
        canDeactivate: [canDeactivateGuard],
      },
      {
        path: RoutingPaths.manualAccountCreationOffenceDetails,
        loadComponent: () =>
          import('./pages/manual-account-creation/offence-details/offence-details.component').then(
            (c) => c.OffenceDetailsComponent,
          ),
        canActivate: [authGuard],
      },
      {
        path: RoutingPaths.manualAccountCreationCompanyDetails,
        loadComponent: () =>
          import('./pages/manual-account-creation/company-details/company-details.component').then(
            (c) => c.CompanyDetailsComponent,
          ),
        canActivate: [authGuard],
        canDeactivate: [canDeactivateGuard],
      },
      {
        path: RoutingPaths.manualAccountCreationCourtDetails,
        loadComponent: () =>
          import('./pages/manual-account-creation/court-details/court-details.component').then(
            (c) => c.CourtDetailsComponent,
          ),
        canActivate: [authGuard],
        canDeactivate: [canDeactivateGuard],
      },
      {
        path: RoutingPaths.manualAccountCreationAccountCommentsNotes,
        loadComponent: () =>
          import('./pages/manual-account-creation/account-comments-notes/account-comments-notes.component').then(
            (c) => c.AccountCommentsNotesComponent,
          ),
        canActivate: [authGuard],
      },
    ],
    resolve: { userState: userStateResolver },
    canDeactivate: [canDeactivateGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      canceledNavigationResolution: 'computed',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
