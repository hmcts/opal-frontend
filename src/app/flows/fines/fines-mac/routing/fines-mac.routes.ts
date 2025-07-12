import { Routes } from '@angular/router';
import { FINES_MAC_ROUTING_PATHS } from './constants/fines-mac-routing-paths.constant';
import { finesMacFlowStateGuard } from '../guards/fines-mac-flow-state/fines-mac-flow-state.guard';
import { routing as offenceDetailsRouting } from '../fines-mac-offence-details/routing/fines-mac-offence-details.routes';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from '../fines-mac-offence-details/routing/constants/fines-mac-offence-details-routing-paths.constant';
import { FINES_MAC_ROUTING_TITLES } from './constants/fines-mac-routing-titles.constant';
import { fetchMapFinesMacPayloadResolver } from './resolvers/fetch-map-fines-mac-payload-resolver/fetch-map-fines-mac-payload.resolver';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { fetchBusinessUnitsResolver } from './resolvers/fetch-business-units-resolver/fetch-business-units.resolver';
import { fetchEnforcementCourtsResolver } from './resolvers/fetch-enforcement-courts-resolver/fetch-enforcement-courts.resolver';
import { fetchSendingCourtsResolver } from './resolvers/fetch-sending-courts-resolver/fetch-sending-courts.resolver';
import { fetchResultsResolver } from '../fines-mac-offence-details/routing/resolvers/fetch-results-resolver/fetch-results.resolver';
import { fetchMajorCreditorsResolver } from '../fines-mac-offence-details/routing/resolvers/fetch-major-creditors-resolver/fetch-major-creditors.resolver';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { FINES_DRAFT_ROUTING_PERMISSIONS } from '../../fines-draft/routing/constants/fines-draft-routing-permissions.constant';
import { fetchProsecutorsResolver } from './resolvers/fetch-prosecutors-resolver/fetch-prosecutors.resolver';

const draftRootPermissionIds = FINES_DRAFT_ROUTING_PERMISSIONS;

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
    canActivate: [authGuard, routePermissionsGuard],
    canDeactivate: [canDeactivateGuard],
    data: {
      title: FINES_MAC_ROUTING_TITLES.children.createAccount,
      permission: 'CREATE_MANAGE_DRAFT_ACCOUNTS',
      routePermissionId: [draftRootPermissionIds['create-and-manage']],
    },
    resolve: {
      title: TitleResolver,
      businessUnits: fetchBusinessUnitsResolver,
    },
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.accountDetails,
    loadComponent: () =>
      import('../fines-mac-account-details/fines-mac-account-details.component').then(
        (c) => c.FinesMacAccountDetailsComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard, finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
    data: {
      title: FINES_MAC_ROUTING_TITLES.children.accountDetails,
      routePermissionId: [draftRootPermissionIds['create-and-manage']],
    },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.employerDetails,
    loadComponent: () =>
      import('../fines-mac-employer-details/fines-mac-employer-details.component').then(
        (c) => c.FinesMacEmployerDetailsComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard, finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
    data: {
      title: FINES_MAC_ROUTING_TITLES.children.employerDetails,
      routePermissionId: [draftRootPermissionIds['create-and-manage']],
    },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.contactDetails,
    loadComponent: () =>
      import('../fines-mac-contact-details/fines-mac-contact-details.component').then(
        (c) => c.FinesMacContactDetailsComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard, finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
    data: {
      title: FINES_MAC_ROUTING_TITLES.children.contactDetails,
      routePermissionId: [draftRootPermissionIds['create-and-manage']],
    },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.parentGuardianDetails,
    loadComponent: () =>
      import('../fines-mac-parent-guardian-details/fines-mac-parent-guardian-details.component').then(
        (c) => c.FinesMacParentGuardianDetailsComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard, finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
    data: {
      title: FINES_MAC_ROUTING_TITLES.children.parentGuardianDetails,
      routePermissionId: [draftRootPermissionIds['create-and-manage']],
    },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.personalDetails,
    loadComponent: () =>
      import('../fines-mac-personal-details/fines-mac-personal-details.component').then(
        (c) => c.FinesMacPersonalDetailsComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard, finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
    data: {
      title: FINES_MAC_ROUTING_TITLES.children.personalDetails,
      routePermissionId: [draftRootPermissionIds['create-and-manage']],
    },
    resolve: { title: TitleResolver },
  },

  {
    path: FINES_MAC_ROUTING_PATHS.children.companyDetails,
    loadComponent: () =>
      import('../fines-mac-company-details/fines-mac-company-details.component').then(
        (c) => c.FinesMacCompanyDetailsComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard, finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
    data: {
      title: FINES_MAC_ROUTING_TITLES.children.companyDetails,
      routePermissionId: [draftRootPermissionIds['create-and-manage']],
    },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.courtDetails,
    loadComponent: () =>
      import('../fines-mac-court-details/fines-mac-court-details.component').then(
        (c) => c.FinesMacCourtDetailsComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard, finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
    data: {
      title: FINES_MAC_ROUTING_TITLES.children.courtDetails,
      routePermissionId: [draftRootPermissionIds['create-and-manage']],
    },
    resolve: {
      title: TitleResolver,
      courts: fetchEnforcementCourtsResolver,
      localJusticeAreas: fetchSendingCourtsResolver,
    },
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.accountCommentsNotes,
    loadComponent: () =>
      import('../fines-mac-account-comments-notes/fines-mac-account-comments-notes.component').then(
        (c) => c.FinesMacAccountCommentsNotesComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard, finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
    data: {
      title: FINES_MAC_ROUTING_TITLES.children.accountCommentsNotes,
      routePermissionId: [draftRootPermissionIds['create-and-manage']],
    },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.paymentTerms,
    loadComponent: () =>
      import('../fines-mac-payment-terms/fines-mac-payment-terms.component').then(
        (c) => c.FinesMacPaymentTermsComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard, finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
    data: {
      title: FINES_MAC_ROUTING_TITLES.children.paymentTerms,
      routePermissionId: [draftRootPermissionIds['create-and-manage']],
    },
    resolve: { title: TitleResolver },
  },
  {
    path: `${FINES_MAC_ROUTING_PATHS.children.deleteAccountConfirmation}/:draftAccountId`,
    loadComponent: () =>
      import('../fines-mac-delete-account-confirmation/fines-mac-delete-account-confirmation.component').then(
        (c) => c.FinesMacDeleteAccountConfirmationComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard, finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
    data: {
      title: FINES_MAC_ROUTING_TITLES.children.deleteAccountConfirmation,
      routePermissionId: [draftRootPermissionIds['create-and-manage'], draftRootPermissionIds['check-and-validate']],
    },
    resolve: { title: TitleResolver },
  },
  {
    path: `${FINES_MAC_ROUTING_PATHS.children.deleteAccountConfirmation}`,
    loadComponent: () =>
      import('../fines-mac-delete-account-confirmation/fines-mac-delete-account-confirmation.component').then(
        (c) => c.FinesMacDeleteAccountConfirmationComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard, finesMacFlowStateGuard],
    data: {
      title: FINES_MAC_ROUTING_TITLES.children.deleteAccountConfirmation,
      routePermissionId: [draftRootPermissionIds['create-and-manage'], draftRootPermissionIds['check-and-validate']],
    },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.languagePreferences,
    loadComponent: () =>
      import('../fines-mac-language-preferences/fines-mac-language-preferences.component').then(
        (c) => c.FinesMacLanguagePreferencesComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard, finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
    data: {
      title: FINES_MAC_ROUTING_TITLES.children.languagePreferences,
      routePermissionId: [draftRootPermissionIds['create-and-manage']],
    },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.root,
    loadComponent: () =>
      import('../fines-mac-offence-details/fines-mac-offence-details.component').then(
        (c) => c.FinesMacOffenceDetailsComponent,
      ),
    children: offenceDetailsRouting,
    canActivate: [authGuard, routePermissionsGuard],
    canDeactivate: [canDeactivateGuard],
    data: {
      title: FINES_MAC_ROUTING_TITLES.children.offenceDetails,
      routePermissionId: [draftRootPermissionIds['create-and-manage']],
    },
    resolve: {
      title: TitleResolver,
    },
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.reviewAccount,
    loadComponent: () =>
      import('../fines-mac-review-account/fines-mac-review-account.component').then(
        (c) => c.FinesMacReviewAccountComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard, finesMacFlowStateGuard],
    data: {
      title: FINES_MAC_ROUTING_TITLES.children.reviewAccount,
      routePermissionId: [draftRootPermissionIds['create-and-manage']],
    },
    resolve: {
      title: TitleResolver,
      courts: fetchEnforcementCourtsResolver,
      localJusticeAreas: fetchSendingCourtsResolver,
      results: fetchResultsResolver,
      majorCreditors: fetchMajorCreditorsResolver,
    },
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.submitConfirmation,
    loadComponent: () =>
      import('../fines-mac-submit-confirmation/fines-mac-submit-confirmation.component').then(
        (c) => c.FinesMacSubmitConfirmationComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard],
    data: {
      title: FINES_MAC_ROUTING_TITLES.children.submitConfirmation,
      routePermissionId: [draftRootPermissionIds['create-and-manage']],
    },
    resolve: {
      title: TitleResolver,
      courts: fetchEnforcementCourtsResolver,
      localJusticeAreas: fetchSendingCourtsResolver,
      results: fetchResultsResolver,
      majorCreditors: fetchMajorCreditorsResolver,
    },
  },
  {
    path: `${FINES_MAC_ROUTING_PATHS.children.reviewAccount}/:draftAccountId`,
    loadComponent: () =>
      import('../fines-mac-review-account/fines-mac-review-account.component').then(
        (c) => c.FinesMacReviewAccountComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard],
    resolve: {
      title: TitleResolver,
      reviewAccountFetchMap: fetchMapFinesMacPayloadResolver,
    },
    data: {
      title: FINES_MAC_ROUTING_TITLES.children.reviewAccount,
      routePermissionId: [draftRootPermissionIds['create-and-manage'], draftRootPermissionIds['check-and-validate']],
    },
  },
  {
    path: `${FINES_MAC_ROUTING_PATHS.children.accountDetails}/:draftAccountId`,
    loadComponent: () =>
      import('../fines-mac-account-details/fines-mac-account-details.component').then(
        (c) => c.FinesMacAccountDetailsComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard],
    canDeactivate: [canDeactivateGuard],
    resolve: { accountDetailsFetchMap: fetchMapFinesMacPayloadResolver },
    data: {
      title: FINES_MAC_ROUTING_TITLES.children.accountDetails,
      routePermissionId: [draftRootPermissionIds['create-and-manage']],
    },
  },
  {
    path: FINES_MAC_ROUTING_PATHS.children.fixedPenaltyDetails,
    loadComponent: () =>
      import('../fines-mac-fixed-penalty-details/fines-mac-fixed-penalty-details.component').then(
        (c) => c.FinesMacFixedPenaltyDetailsComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard],
    canDeactivate: [canDeactivateGuard],
    resolve: {
      title: TitleResolver,
      courts: fetchEnforcementCourtsResolver,
      prosecutors: fetchProsecutorsResolver,
      localJusticeAreas: fetchSendingCourtsResolver,
    },
    data: {
      title: FINES_MAC_ROUTING_TITLES.children.fixedPenaltyDetails,
      routePermissionId: [draftRootPermissionIds['create-and-manage']],
    },
  },
];
