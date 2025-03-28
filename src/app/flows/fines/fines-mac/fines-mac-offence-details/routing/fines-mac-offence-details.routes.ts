import { Routes } from '@angular/router';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from './constants/fines-mac-offence-details-routing-paths.constant';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_TITLES } from './constants/fines-mac-offence-details-routing-titles.constant';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards';

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
    data: { title: FINES_MAC_OFFENCE_DETAILS_ROUTING_TITLES.children.reviewOffences },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence,
    loadComponent: () =>
      import('../fines-mac-offence-details-add-an-offence/fines-mac-offence-details-add-an-offence.component').then(
        (c) => c.FinesMacOffenceDetailsAddAnOffenceComponent,
      ),
    data: { title: FINES_MAC_OFFENCE_DETAILS_ROUTING_TITLES.children.addOffence },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.searchOffences,
    loadComponent: () =>
      import('../fines-mac-offence-details-search-offences/fines-mac-offence-details-search-offences.component').then(
        (c) => c.FinesMacOffenceDetailsSearchOffencesComponent,
      ),
    data: { title: FINES_MAC_OFFENCE_DETAILS_ROUTING_TITLES.children.searchOffences },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.removeImposition,
    loadComponent: () =>
      import(
        '../fines-mac-offence-details-remove-imposition/fines-mac-offence-details-remove-imposition.component'
      ).then((c) => c.FinesMacOffenceDetailsRemoveImpositionComponent),
    data: { title: FINES_MAC_OFFENCE_DETAILS_ROUTING_TITLES.children.removeImposition },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addMinorCreditor,
    loadComponent: () =>
      import('../fines-mac-offence-details-minor-creditor/fines-mac-offence-details-minor-creditor.component').then(
        (c) => c.FinesMacOffenceDetailsMinorCreditorComponent,
      ),
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

    data: { title: FINES_MAC_OFFENCE_DETAILS_ROUTING_TITLES.children.removeMinorCreditor },
    resolve: { title: TitleResolver },
  },
  {
    path: FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.removeOffence,
    loadComponent: () =>
      import(
        '../fines-mac-offence-details-remove-offence-and-impositions/fines-mac-offence-details-remove-offence-and-impositions.component'
      ).then((c) => c.FinesMacOffenceDetailsRemoveOffenceAndImpositionsComponent),
    data: { title: FINES_MAC_OFFENCE_DETAILS_ROUTING_TITLES.children.removeOffence },
    resolve: { title: TitleResolver },
  },
];
