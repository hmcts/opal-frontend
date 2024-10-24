import { Routes } from '@angular/router';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from './constants/fines-mac-offence-details-routing-paths.constant';

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
  },
  {
    path: FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence,
    loadComponent: () =>
      import('../fines-mac-offence-details-add-an-offence/fines-mac-offence-details-add-an-offence.component').then(
        (c) => c.FinesMacOffenceDetailsAddAnOffenceComponent,
      ),
  },
  {
    path: FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.searchOffences,
    loadComponent: () =>
      import('../fines-mac-offence-details-search-offences/fines-mac-offence-details-search-offences.component').then(
        (c) => c.FinesMacOffenceDetailsSearchOffencesComponent,
      ),
  },
  {
    path: FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.removeImposition,
    loadComponent: () =>
      import(
        '../fines-mac-offence-details-remove-imposition/fines-mac-offence-details-remove-imposition.component'
      ).then((c) => c.FinesMacOffenceDetailsRemoveImpositionComponent),
  },
  {
    path: FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addMinorCreditor,
    loadComponent: () =>
      import('../fines-mac-offence-details-minor-creditor/fines-mac-offence-details-minor-creditor.component').then(
        (c) => c.FinesMacOffenceDetailsMinorCreditorComponent,
      ),
  },
];
