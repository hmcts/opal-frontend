import { Routes } from '@angular/router';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from './constants/fines-mac-offence-details-routing-paths.constant';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_TITLES } from './constants/fines-mac-offence-details-routing-titles.constant';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { finesMacFlowStateGuard } from '../../guards/fines-mac-flow-state/fines-mac-flow-state.guard';
import { routing as searchOffencesRouting } from '../fines-mac-offence-details-search-offences/routing/fines-mac-offence-details-search-offences.routes';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_ROUTING_TITLES } from '../fines-mac-offence-details-search-offences/routing/constants/fines-mac-offence-details-search-offences-routing-titles.constant';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_ROUTING_PATHS } from '../fines-mac-offence-details-search-offences/routing/constants/fines-mac-offence-details-search-offences-routing-paths.constant';

export const routing: Routes = [
  {
    path: '',
    redirectTo: FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.reviewOffences,
    pathMatch: 'full',
  },
  {
    path: FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.reviewOffences,
    loadComponent: () =>
      import('../fines-mac-offence-details-review/fines-mac-offence-details-review.component').then(
        (c) => c.FinesMacOffenceDetailsReviewComponent,
      ),
    canActivate: [finesMacFlowStateGuard],
    data: { title: FINES_MAC_OFFENCE_DETAILS_ROUTING_TITLES.children.reviewOffences },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence,
    loadComponent: () =>
      import('../fines-mac-offence-details-add-an-offence/fines-mac-offence-details-add-an-offence.component').then(
        (c) => c.FinesMacOffenceDetailsAddAnOffenceComponent,
      ),
    canActivate: [finesMacFlowStateGuard],
    data: { title: FINES_MAC_OFFENCE_DETAILS_ROUTING_TITLES.children.addOffence },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_ROUTING_PATHS.root,
    loadComponent: () =>
      import('../fines-mac-offence-details-search-offences/fines-mac-offence-details-search-offences.component').then(
        (c) => c.FinesMacOffenceDetailsSearchOffencesComponent,
      ),
    children: searchOffencesRouting,
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard],
    data: { title: FINES_MAC_OFFENCE_DETAILS_SEARCH_OFFENCES_ROUTING_TITLES.root },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.removeImposition,
    loadComponent: () =>
      import(
        '../fines-mac-offence-details-remove-imposition/fines-mac-offence-details-remove-imposition.component'
      ).then((c) => c.FinesMacOffenceDetailsRemoveImpositionComponent),
    canActivate: [finesMacFlowStateGuard],
    data: { title: FINES_MAC_OFFENCE_DETAILS_ROUTING_TITLES.children.removeImposition },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addMinorCreditor,
    loadComponent: () =>
      import('../fines-mac-offence-details-minor-creditor/fines-mac-offence-details-minor-creditor.component').then(
        (c) => c.FinesMacOffenceDetailsMinorCreditorComponent,
      ),
    canActivate: [finesMacFlowStateGuard],
    canDeactivate: [canDeactivateGuard],
    data: { title: FINES_MAC_OFFENCE_DETAILS_ROUTING_TITLES.children.addMinorCreditor },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.removeMinorCreditor,
    loadComponent: () =>
      import(
        '../fines-mac-offence-details-remove-minor-creditor/fines-mac-offence-details-remove-minor-creditor.component'
      ).then((c) => c.FinesMacOffenceDetailsRemoveMinorCreditorComponent),
    canActivate: [finesMacFlowStateGuard],
    data: { title: FINES_MAC_OFFENCE_DETAILS_ROUTING_TITLES.children.removeMinorCreditor },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.removeOffence,
    loadComponent: () =>
      import(
        '../fines-mac-offence-details-remove-offence-and-impositions/fines-mac-offence-details-remove-offence-and-impositions.component'
      ).then((c) => c.FinesMacOffenceDetailsRemoveOffenceAndImpositionsComponent),
    canActivate: [finesMacFlowStateGuard],
    data: { title: FINES_MAC_OFFENCE_DETAILS_ROUTING_TITLES.children.removeOffence },
    resolve: { title: TitleResolver },
  },
];
