import { Routes } from '@angular/router';
import { authGuard, canDeactivateGuard } from '@guards';
import { FinesMacRoutingPaths } from '../enums';

export const routing: Routes = [
  {
    path: '',
    redirectTo: FinesMacRoutingPaths.finesMacCreateAccount,
    pathMatch: 'full',
  },
  {
    path: FinesMacRoutingPaths.finesMacCreateAccount,
    loadComponent: () =>
      import('../fines-mac-create-account/fines-mac-create-account.component').then(
        (c) => c.FinesMacCreateAccountComponent,
      ),
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: FinesMacRoutingPaths.finesMacAccountDetails,
    loadComponent: () =>
      import('../fines-mac-account-details/fines-mac-account-details.component').then(
        (c) => c.FinesMacAccountDetailsComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: FinesMacRoutingPaths.finesMacEmployerDetails,
    loadComponent: () =>
      import('../fines-mac-employer-details/fines-mac-employer-details.component').then(
        (c) => c.FinesMacEmployerDetailsComponent,
      ),
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: FinesMacRoutingPaths.finesMacContactDetails,
    loadComponent: () =>
      import('../fines-mac-contact-details/fines-mac-contact-details.component').then(
        (c) => c.FinesMacContactDetailsComponent,
      ),
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: FinesMacRoutingPaths.finesMacParentGuardianDetails,
    loadComponent: () =>
      import('../fines-mac-parent-guardian-details/fines-mac-parent-guardian-details.component').then(
        (c) => c.FinesMacParentGuardianDetailsComponent,
      ),
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: FinesMacRoutingPaths.finesMacPersonalDetails,
    loadComponent: () =>
      import('../fines-mac-personal-details/fines-mac-personal-details.component').then(
        (c) => c.FinesMacPersonalDetailsComponent,
      ),
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: FinesMacRoutingPaths.finesMacOffenceDetails,
    loadComponent: () =>
      import('../fines-mac-offence-details/fines-mac-offence-details.component').then(
        (c) => c.FinesMacOffenceDetailsComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: FinesMacRoutingPaths.finesMacCompanyDetails,
    loadComponent: () =>
      import('../fines-mac-company-details/fines-mac-company-details.component').then(
        (c) => c.FinesMacCompanyDetailsComponent,
      ),
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: FinesMacRoutingPaths.finesMacCourtDetails,
    loadComponent: () =>
      import('../fines-mac-court-details/fines-mac-court-details.component').then(
        (c) => c.FinesMacCourtDetailsComponent,
      ),
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: FinesMacRoutingPaths.finesMacAccountCommentsNotes,
    loadComponent: () =>
      import('../fines-mac-account-comments-notes/fines-mac-account-comments-notes.component').then(
        (c) => c.FinesMacAccountCommentsNotesComponent,
      ),
    canActivate: [authGuard],
  },
];
