import { Routes } from '@angular/router';
import { RoutingPaths } from '@enums';
import { authGuard, canDeactivateGuard } from '@guards';

export const macRouting: Routes = [
  {
    path: '',
    redirectTo: RoutingPaths.manualAccountCreationCreateAccount,
    pathMatch: 'full',
  },
  {
    path: RoutingPaths.manualAccountCreationCreateAccount,
    loadComponent: () =>
      import('../../pages/fines/fines-mac/fines-mac-create-account/fines-mac-create-account.component').then(
        (c) => c.FinesMacCreateAccountComponent,
      ),
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: RoutingPaths.manualAccountCreationAccountDetails,
    loadComponent: () =>
      import('../../pages/fines/fines-mac/fines-mac-account-details/fines-mac-account-details.component').then(
        (c) => c.FinesMacAccountDetailsComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: RoutingPaths.manualAccountCreationEmployerDetails,
    loadComponent: () =>
      import('../../pages/fines/fines-mac/fines-mac-employer-details/fines-mac-employer-details.component').then(
        (c) => c.FinesMacEmployerDetailsComponent,
      ),
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: RoutingPaths.manualAccountCreationContactDetails,
    loadComponent: () =>
      import('../../pages/fines/fines-mac/fines-mac-contact-details/fines-mac-contact-details.component').then(
        (c) => c.FinesMacContactDetailsComponent,
      ),
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: RoutingPaths.manualAccountCreationParentGuardianDetails,
    loadComponent: () =>
      import(
        '../../pages/fines/fines-mac/fines-mac-parent-guardian-details/fines-mac-parent-guardian-details.component'
      ).then((c) => c.FinesMacParentGuardianDetailsComponent),
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: RoutingPaths.manualAccountCreationPersonalDetails,
    loadComponent: () =>
      import('../../pages/fines/fines-mac/fines-mac-personal-details/fines-mac-personal-details.component').then(
        (c) => c.FinesMacPersonalDetailsComponent,
      ),
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: RoutingPaths.manualAccountCreationOffenceDetails,
    loadComponent: () =>
      import('../../pages/fines/fines-mac/fines-mac-offence-details/fines-mac-offence-details.component').then(
        (c) => c.FinesMacOffenceDetailsComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: RoutingPaths.manualAccountCreationCompanyDetails,
    loadComponent: () =>
      import('../../pages/fines/fines-mac/fines-mac-company-details/fines-mac-company-details.component').then(
        (c) => c.FinesMacCompanyDetailsComponent,
      ),
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: RoutingPaths.manualAccountCreationCourtDetails,
    loadComponent: () =>
      import('../../pages/fines/fines-mac/fines-mac-court-details/fines-mac-court-details.component').then(
        (c) => c.FinesMacCourtDetailsComponent,
      ),
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard],
  },
];
