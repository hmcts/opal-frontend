import { Routes } from '@angular/router';
import { authGuard, canDeactivateGuard } from '@guards';

import { FINES_MAC_ROUTING_PATHS } from './constants';
import { finesMacFlowStateGuard } from '../guards';

export const routing: Routes = [
  {
    path: '',
    redirectTo: FINES_MAC_ROUTING_PATHS.children.createAccount,
    pathMatch: 'full',
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.createAccount,
    loadComponent: () =>
      import('../fines-mac-create-account/fines-mac-create-account.component').then(
        (c) => c.FinesMacCreateAccountComponent,
      ),
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.accountDetails,
    loadComponent: () =>
      import('../fines-mac-account-details/fines-mac-account-details.component').then(
        (c) => c.FinesMacAccountDetailsComponent,
      ),
    canActivate: [authGuard, finesMacFlowStateGuard],
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.employerDetails,
    loadComponent: () =>
      import('../fines-mac-employer-details/fines-mac-employer-details.component').then(
        (c) => c.FinesMacEmployerDetailsComponent,
      ),
    canActivate: [authGuard, finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.contactDetails,
    loadComponent: () =>
      import('../fines-mac-contact-details/fines-mac-contact-details.component').then(
        (c) => c.FinesMacContactDetailsComponent,
      ),
    canActivate: [authGuard, finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.parentGuardianDetails,
    loadComponent: () =>
      import('../fines-mac-parent-guardian-details/fines-mac-parent-guardian-details.component').then(
        (c) => c.FinesMacParentGuardianDetailsComponent,
      ),
    canActivate: [authGuard, finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.personalDetails,
    loadComponent: () =>
      import('../fines-mac-personal-details/fines-mac-personal-details.component').then(
        (c) => c.FinesMacPersonalDetailsComponent,
      ),
    canActivate: [authGuard, finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.offenceDetails,
    loadComponent: () =>
      import('../fines-mac-offence-details/fines-mac-offence-details.component').then(
        (c) => c.FinesMacOffenceDetailsComponent,
      ),
    canActivate: [authGuard, finesMacFlowStateGuard],
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.companyDetails,
    loadComponent: () =>
      import('../fines-mac-company-details/fines-mac-company-details.component').then(
        (c) => c.FinesMacCompanyDetailsComponent,
      ),
    canActivate: [authGuard, finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.courtDetails,
    loadComponent: () =>
      import('../fines-mac-court-details/fines-mac-court-details.component').then(
        (c) => c.FinesMacCourtDetailsComponent,
      ),
    canActivate: [authGuard, finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.accountCommentsNotes,
    loadComponent: () =>
      import('../fines-mac-account-comments-notes/fines-mac-account-comments-notes.component').then(
        (c) => c.FinesMacAccountCommentsNotesComponent,
      ),
    canActivate: [authGuard, finesMacFlowStateGuard],
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.paymentTerms,
    loadComponent: () =>
      import('../fines-mac-payment-terms/fines-mac-payment-terms.component').then(
        (c) => c.FinesMacPaymentTermsComponent,
      ),
    canActivate: [authGuard, finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
  },
];
