import { Routes } from '@angular/router';
import { FINES_MAC_ROUTING_PATHS } from './constants/fines-mac-routing-paths.constant';
import { finesMacFlowStateGuard } from '../guards/fines-mac-flow-state/fines-mac-flow-state.guard';
import { routing as offenceDetailsRouting } from '../fines-mac-offence-details/routing/fines-mac-offence-details.routes';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../fines-mac-offence-details/routing/constants/fines-mac-offence-details-routing-paths.constant';
import { FINES_MAC_ROUTING_TITLES } from './constants/fines-mac-routing-titles.constant';
import { authGuard, canDeactivateGuard, TitleResolver } from 'opal-frontend-common';

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
    data: { title: FINES_MAC_ROUTING_TITLES.children.createAccount },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.accountDetails,
    loadComponent: () =>
      import('../fines-mac-account-details/fines-mac-account-details.component').then(
        (c) => c.FinesMacAccountDetailsComponent,
      ),
    canActivate: [authGuard, finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
    data: { title: FINES_MAC_ROUTING_TITLES.children.accountDetails },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.employerDetails,
    loadComponent: () =>
      import('../fines-mac-employer-details/fines-mac-employer-details.component').then(
        (c) => c.FinesMacEmployerDetailsComponent,
      ),
    canActivate: [authGuard, finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
    data: { title: FINES_MAC_ROUTING_TITLES.children.employerDetails },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.contactDetails,
    loadComponent: () =>
      import('../fines-mac-contact-details/fines-mac-contact-details.component').then(
        (c) => c.FinesMacContactDetailsComponent,
      ),
    canActivate: [authGuard, finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
    data: { title: FINES_MAC_ROUTING_TITLES.children.contactDetails },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.parentGuardianDetails,
    loadComponent: () =>
      import('../fines-mac-parent-guardian-details/fines-mac-parent-guardian-details.component').then(
        (c) => c.FinesMacParentGuardianDetailsComponent,
      ),
    canActivate: [authGuard, finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
    data: { title: FINES_MAC_ROUTING_TITLES.children.parentGuardianDetails },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.personalDetails,
    loadComponent: () =>
      import('../fines-mac-personal-details/fines-mac-personal-details.component').then(
        (c) => c.FinesMacPersonalDetailsComponent,
      ),
    canActivate: [authGuard, finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
    data: { title: FINES_MAC_ROUTING_TITLES.children.personalDetails },
    resolve: { title: TitleResolver },
  },

  {
    path: FINES_MAC_ROUTING_PATHS.children.companyDetails,
    loadComponent: () =>
      import('../fines-mac-company-details/fines-mac-company-details.component').then(
        (c) => c.FinesMacCompanyDetailsComponent,
      ),
    canActivate: [authGuard, finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
    data: { title: FINES_MAC_ROUTING_TITLES.children.companyDetails },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.courtDetails,
    loadComponent: () =>
      import('../fines-mac-court-details/fines-mac-court-details.component').then(
        (c) => c.FinesMacCourtDetailsComponent,
      ),
    canActivate: [authGuard, finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
    data: { title: FINES_MAC_ROUTING_TITLES.children.courtDetails },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.accountCommentsNotes,
    loadComponent: () =>
      import('../fines-mac-account-comments-notes/fines-mac-account-comments-notes.component').then(
        (c) => c.FinesMacAccountCommentsNotesComponent,
      ),
    canActivate: [authGuard, finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
    data: { title: FINES_MAC_ROUTING_TITLES.children.accountCommentsNotes },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.paymentTerms,
    loadComponent: () =>
      import('../fines-mac-payment-terms/fines-mac-payment-terms.component').then(
        (c) => c.FinesMacPaymentTermsComponent,
      ),
    canActivate: [authGuard, finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
    data: { title: FINES_MAC_ROUTING_TITLES.children.paymentTerms },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.deleteAccountConfirmation,
    loadComponent: () =>
      import('../fines-mac-delete-account-confirmation/fines-mac-delete-account-confirmation.component').then(
        (c) => c.FinesMacDeleteAccountConfirmationComponent,
      ),
    canActivate: [authGuard, finesMacFlowStateGuard],
    data: { title: FINES_MAC_ROUTING_TITLES.children.deleteAccountConfirmation },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.languagePreferences,
    loadComponent: () =>
      import('../fines-mac-language-preferences/fines-mac-language-preferences.component').then(
        (c) => c.FinesMacLanguagePreferencesComponent,
      ),
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard],
    data: { title: FINES_MAC_ROUTING_TITLES.children.languagePreferences },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.root,
    loadComponent: () =>
      import('../fines-mac-offence-details/fines-mac-offence-details.component').then(
        (c) => c.FinesMacOffenceDetailsComponent,
      ),
    children: offenceDetailsRouting,
    canActivate: [authGuard, finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
    data: { title: FINES_MAC_ROUTING_TITLES.children.offenceDetails },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.reviewAccount,
    loadComponent: () =>
      import('../fines-mac-review-account/fines-mac-review-account.component').then(
        (c) => c.FinesMacReviewAccountComponent,
      ),
    canActivate: [authGuard, finesMacFlowStateGuard],
    data: { title: FINES_MAC_ROUTING_TITLES.children.reviewAccount },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.submitConfirmation,
    loadComponent: () =>
      import('../fines-mac-submit-confirmation/fines-mac-submit-confirmation.component').then(
        (c) => c.FinesMacSubmitConfirmationComponent,
      ),
    canActivate: [authGuard],
    data: { title: FINES_MAC_ROUTING_TITLES.children.submitConfirmation },
    resolve: { title: TitleResolver },
  },
];
