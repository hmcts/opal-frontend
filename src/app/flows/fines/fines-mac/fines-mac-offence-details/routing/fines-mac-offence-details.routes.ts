import { Routes } from '@angular/router';
import { FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS } from './constants/fines-mac-offence-details-routing-paths';
import { authGuard } from '@guards/auth/auth.guard';
import { finesMacFlowStateGuard } from '../../guards/fines-mac-flow-state/fines-mac-flow-state.guard';

export const routing: Routes = [
  {
    path: '',
    redirectTo: FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence,
    pathMatch: 'full',
  },
  {
    path: FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.addOffence,
    loadComponent: () =>
      import('../fines-mac-offence-details.component').then((c) => c.FinesMacOffenceDetailsComponent),
    canActivate: [authGuard, finesMacFlowStateGuard],
  },
  {
    path: FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.searchOffences,
    loadComponent: () =>
      import('../fines-mac-offence-details-search-offences/fines-mac-offence-details-search-offences.component').then(
        (c) => c.FinesMacOffenceDetailsSearchOffencesComponent,
      ),
    canActivate: [authGuard, finesMacFlowStateGuard],
  },
  {
    path: FINES_MAC_OFFENCE_DETAILS_ROUTING_PATHS.children.removeImposition,
    loadComponent: () =>
      import(
        '../fines-mac-offence-details-remove-imposition/fines-mac-offence-details-remove-imposition.component'
      ).then((c) => c.FinesMacOffenceDetailsRemoveImpositionComponent),
    canActivate: [authGuard, finesMacFlowStateGuard],
  },
];
