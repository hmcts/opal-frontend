import { Routes } from '@angular/router';
import { FINES_ACC_ROUTING_PATHS } from './constants/fines-acc-routing-paths.constant';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { FINES_PERMISSIONS } from '../../../../constants/fines-permissions.constant';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';
import { defendantAccountHeadingResolver } from './resolvers/defendant-account-heading.resolver';
import { defendantAccountAtAGlanceResolver } from './resolvers/defendant-account-at-a-glance.resolver';
import { finesAccStateGuard } from './guards/fines-acc-state-guard/fines-acc-state.guard';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { FINES_ACC_DEFENDANT_ROUTING_PATHS } from './constants/fines-acc-defendant-routing-paths.constant';
import { FINES_ACC_DEFENDANT_ROUTING_TITLES } from './constants/fines-acc-defendant-routing-titles.constant';
import { FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS } from './constants/fines-acc-minor-creditor-routing-paths.constant';
import { FINES_ACC_MINOR_CREDITOR_ROUTING_TITLES } from './constants/fines-acc-minor-creditor-routing-titles.constant';
import { defendantAccountPartyResolver } from './resolvers/defendant-account-party.resolver';
import { defendantAccountPaymentTermsLatestResolver } from './resolvers/defendant-account-payment-terms-latest.resolver';
import { minorCreditorAccountHeadingResolver } from './resolvers/defendant-minor-creditor-heading.resolver';

const accRootPermissionIds = FINES_PERMISSIONS;

export const routing: Routes = [
  {
    path: FINES_ACC_ROUTING_PATHS.root,
    redirectTo: PAGES_ROUTING_PATHS.children.dashboard, // Redirect to dashboard
    pathMatch: 'full',
    canActivateChild: [authGuard, routePermissionsGuard],
    data: {
      routePermissionId: [accRootPermissionIds['search-and-view-accounts']],
    },
  },
  {
    path: `${FINES_ACC_DEFENDANT_ROUTING_PATHS.root}/:accountId`,
    canActivateChild: [authGuard, routePermissionsGuard],
    data: {
      routePermissionId: [accRootPermissionIds['search-and-view-accounts']],
    },
    children: [
      {
        path: FINES_ACC_DEFENDANT_ROUTING_PATHS.children.details,

        loadComponent: () =>
          import('../fines-acc-defendant-details/fines-acc-defendant-details.component').then(
            (c) => c.FinesAccDefendantDetailsComponent,
          ),
        data: {
          title: FINES_ACC_DEFENDANT_ROUTING_TITLES.children.details,
        },
        resolve: { title: TitleResolver, defendantAccountHeadingData: defendantAccountHeadingResolver },
      },
      {
        path: `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.note}/add`,

        loadComponent: () =>
          import('../fines-acc-note-add/fines-acc-note-add.component').then((c) => c.FinesAccNoteAddComponent),
        canActivate: [authGuard, routePermissionsGuard, finesAccStateGuard],
        canDeactivate: [canDeactivateGuard],
        data: {
          routePermissionId: [accRootPermissionIds['add-account-activity-notes']],
          title: FINES_ACC_DEFENDANT_ROUTING_TITLES.children.note,
        },
        resolve: { title: TitleResolver },
      },
      {
        path: `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children.comments}/add`,

        loadComponent: () =>
          import('../fines-acc-comments-add/fines-acc-comments-add.component').then(
            (c) => c.FinesAccCommentsAddComponent,
          ),
        canActivate: [routePermissionsGuard, finesAccStateGuard],
        canDeactivate: [canDeactivateGuard],
        data: {
          routePermissionId: [accRootPermissionIds['account-maintenance']],
          title: FINES_ACC_DEFENDANT_ROUTING_TITLES.children.comments,
        },
        resolve: {
          title: TitleResolver,
          defendantAccountHeadingData: defendantAccountHeadingResolver,
          commentsFormData: defendantAccountAtAGlanceResolver,
        },
      },
      {
        path: `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children['payment-terms']}/amend`,

        loadComponent: () =>
          import('../fines-acc-payment-terms-amend/fines-acc-payment-terms-amend.component').then(
            (c) => c.FinesAccPaymentTermsAmendComponent,
          ),
        canActivate: [routePermissionsGuard, finesAccStateGuard],
        canDeactivate: [canDeactivateGuard],
        data: {
          routePermissionId: [accRootPermissionIds['amend-payment-terms']],
          title: FINES_ACC_DEFENDANT_ROUTING_TITLES.children['payment-terms'],
          accessDeniedPath: `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children['payment-terms']}/denied/permission`,
        },
        resolve: {
          title: TitleResolver,
          paymentTermsFormData: defendantAccountPaymentTermsLatestResolver,
          defendantAccountHeadingData: defendantAccountHeadingResolver,
        },
      },
      {
        path: `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children['payment-terms']}/denied/:type`,

        loadComponent: () =>
          import('../fines-acc-payment-terms-amend-denied/fines-acc-payment-terms-amend-denied.component').then(
            (c) => c.FinesAccPaymentTermsAmendDeniedComponent,
          ),
        canActivate: [routePermissionsGuard],
        data: {
          title: FINES_ACC_DEFENDANT_ROUTING_TITLES.children['payment-terms'],
        },
        resolve: {
          title: TitleResolver,
          defendantAccountHeadingData: defendantAccountHeadingResolver,
          defendantAccountPaymentTermsData: defendantAccountPaymentTermsLatestResolver,
        },
      },
      {
        path: `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children['party']}/:partyType/amend`,

        loadComponent: () =>
          import('../fines-acc-party-add-amend-convert/fines-acc-party-add-amend-convert.component').then(
            (c) => c.FinesAccPartyAddAmendConvert,
          ),
        canActivate: [routePermissionsGuard, finesAccStateGuard],
        canDeactivate: [canDeactivateGuard],
        data: {
          routePermissionId: [accRootPermissionIds['account-maintenance']],
          title: FINES_ACC_DEFENDANT_ROUTING_TITLES.children.debtor,
        },
        resolve: {
          title: TitleResolver,
          partyAddAmendConvertData: defendantAccountPartyResolver,
        },
      },
      {
        path: `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children['payment-card']}/request`,

        loadComponent: () =>
          import('../fines-acc-request-payment-card-submit/fines-acc-request-payment-card-submit.component').then(
            (c) => c.FinesAccRequestPaymentCardSubmitComponent,
          ),
        canActivate: [routePermissionsGuard],
        data: {
          routePermissionId: [accRootPermissionIds['amend-payment-terms']],
          title: FINES_ACC_DEFENDANT_ROUTING_TITLES.children['payment-card'],
          accessDeniedPath: `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children['payment-card']}/denied/permission`,
        },
        resolve: {
          title: TitleResolver,
        },
      },
      {
        path: `${FINES_ACC_DEFENDANT_ROUTING_PATHS.children['payment-card']}/denied/:type`,

        loadComponent: () =>
          import('../fines-acc-request-payment-card-access-denied/fines-acc-request-payment-card-access-denied.component').then(
            (c) => c.FinesAccRequestPaymentCardAccessDeniedComponent,
          ),
        canActivate: [routePermissionsGuard],
        data: {
          title: FINES_ACC_DEFENDANT_ROUTING_TITLES.children['payment-card'],
        },
        resolve: {
          title: TitleResolver,
          defendantAccountPaymentTermsData: defendantAccountPaymentTermsLatestResolver,
        },
      },
    ],
  },
  {
    path: `${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.root}/:accountId`,
    canActivateChild: [authGuard, routePermissionsGuard],
    data: {
      routePermissionId: [accRootPermissionIds['search-and-view-accounts']],
    },
    children: [
      {
        path: FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children.details,

        loadComponent: () =>
          import('../fines-acc-minor-creditor-details/fines-acc-minor-creditor-details.component').then(
            (c) => c.FinesAccMinorCreditorDetailsComponent,
          ),
        data: {
          title: FINES_ACC_MINOR_CREDITOR_ROUTING_TITLES.children.details,
        },
        resolve: { title: TitleResolver, minorCreditorAccountHeadingData: minorCreditorAccountHeadingResolver },
      },
      {
        path: `${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children.note}/add`,

        loadComponent: () =>
          import('../fines-acc-note-add/fines-acc-note-add.component').then((c) => c.FinesAccNoteAddComponent),
        canActivate: [authGuard, routePermissionsGuard, finesAccStateGuard],
        canDeactivate: [canDeactivateGuard],
        data: {
          routePermissionId: [accRootPermissionIds['add-account-activity-notes']],
          title: FINES_ACC_MINOR_CREDITOR_ROUTING_TITLES.children.note,
        },
        resolve: { title: TitleResolver },
      },
      {
        path: `${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children['payment-hold']}/add`,

        loadComponent: () =>
          import('../fines-acc-payment-hold-add/fines-acc-payment-hold-add.component').then(
            (c) => c.FinesAccPaymentHoldAddComponent,
          ),
        canActivate: [authGuard, finesAccStateGuard],
        canDeactivate: [canDeactivateGuard],
        data: {
          title: FINES_ACC_MINOR_CREDITOR_ROUTING_TITLES.children['payment-hold'],
        },
        resolve: { title: TitleResolver },
      },
      {
        path: `${FINES_ACC_MINOR_CREDITOR_ROUTING_PATHS.children['payment-hold']}/remove`,

        loadComponent: () =>
          import('../fines-acc-payment-hold-remove/fines-acc-payment-hold-remove.component').then(
            (c) => c.FinesAccPaymentHoldRemoveComponent,
          ),
        canActivate: [authGuard, finesAccStateGuard],
        canDeactivate: [canDeactivateGuard],
        data: {
          title: FINES_ACC_MINOR_CREDITOR_ROUTING_TITLES.children['payment-hold'],
        },
        resolve: { title: TitleResolver },
      },
    ],
  },
];
